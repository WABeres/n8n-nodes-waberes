import { EngineResponse, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeOperationError } from 'n8n-workflow';
import { signRequest, verifyWebhookSignature } from './utils';

export class Waberes implements INodeType {
    description: INodeTypeDescription = {
        displayName: "WABeres",
        name: "waberes",
        icon: "file:waberes.svg",
        group: ['transform'],
        version: 1,
        description: "Interact with WABeres API",
        defaults: { name: 'WABeres' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [{ name: 'waberesApi', required: true }],
        properties: [
            {
                displayName: "Resource",
                name: 'resource',
                type: 'options',
                options: [
                    { name: 'Message', value: 'message' },
                    { name: 'Webhook', value: 'webhook' }
                ],
                default: 'message'
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['message']
                    }
                },
                options: [
                    { name: 'Send Text', value: 'sendText' },
                    { name: 'Send Chat Presence', value: 'sendChatPresence' },
                ],
                default: 'sendText'
            },
            // ── Operation untuk webhook ──────────────────────────────
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['webhook']
                    }
                },
                options: [
                    { name: 'Verify Signature', value: 'verifySignature' },
                ],
                default: 'verifySignature'
            },
            {
                displayName: 'Device ID',
                name: 'deviceId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['message']
                    }
                },
                default: '',
                placeholder: '01ABCDEFGHIJKLMN',
                description: 'Device ID yang bisa anda dapatkan dari dashboard anda'
            },
            {
                displayName: 'Phone Number',
                name: 'phoneNumber',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['message']
                    }
                },
                default: '',
                placeholder: '6281234567890',
                description: 'Nomor whatsapp tujuan, isi dengan kode negara tanpa simbol +'
            },
            {
                displayName: 'Message',
                name: 'message',
                type: 'string',
                required: true,
                typeOptions: {
                    rows: 4
                },
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['sendText']
                    }
                },
                default: ''
            },
            // ── Action untuk sendChatPresence ────────────────────────
            {
                displayName: 'Action',
                name: 'action',
                type: 'options',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['sendChatPresence']
                    }
                },
                options: [
                    { name: 'Start', value: 'start' },
                    { name: 'Stop', value: 'stop' },
                ],
                default: 'start',
                description: "start = starting typing signal | stop = stopping typing signal"
            },
            // ── Fields untuk verifySignature ─────────────────────────
            {
                displayName: 'Raw Body',
                name: 'rawBody',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['webhook'],
                        operation: ['verifySignature']
                    }
                },
                default: '={{ $json.body.toJsonString() }}',
                description: 'Raw request body dari Webhook node'
            },
            {
                displayName: 'Signature',
                name: 'signature',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['webhook'],
                        operation: ['verifySignature']
                    }
                },
                default: '={{ $json.headers["x-webhook-signature"] }}',
                description: 'Signature dari header webhook request'
            },
            {
                displayName: 'Timestamp',
                name: 'timestamp',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['webhook'],
                        operation: ['verifySignature']
                    }
                },
                default: '={{ $json.headers["x-webhook-timestamp"] }}',
                description: 'Timestamp dari header webhook request'
            },
            {
                displayName: 'Webhook ID',
                name: 'webhookId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['webhook'],
                        operation: ['verifySignature']
                    }
                },
                default: '={{ $json.headers["x-webhook-id"] }}',
                description: 'Webhook ID dari header webhook request'
            }
        ]
    };

    async execute(this: IExecuteFunctions, response?: EngineResponse): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const results: INodeExecutionData[] = [];
        const credentials = await this.getCredentials('waberesApi');

        const apiKey = credentials.apiKey as string;
        const secretKey = credentials.secretKey as string;
        const baseUrl = credentials.baseUrl as string;

        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;

                // ── Messages ─────────────────────────────────────────
                if (resource === 'message') {

                    if (operation === 'sendText') {
                        const deviceId = this.getNodeParameter('deviceId', i) as string;
                        const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
                        const message = this.getNodeParameter('message', i) as string;

                        const path = '/api/v1/messages/send';
                        const body = JSON.stringify({ phone_destination: phoneNumber, message });
                        const { signature, timestamp } = signRequest('POST', path, body, secretKey);

                        const res = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}${path}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': apiKey,
                                'X-Timestamp': timestamp,
                                'X-Signature': signature,
                                'X-Device-ID': deviceId,
                            },
                            body,
                        });

                        results.push({ json: res, pairedItem: i });
                    }

                    if (operation === 'sendChatPresence') {
                        const deviceId = this.getNodeParameter('deviceId', i) as string;
                        const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
                        const action = this.getNodeParameter('action', i) as 'start' | 'stop';

                        const path = '/api/v1/messages/chat-presence';
                        const body = JSON.stringify({ phone_destination: phoneNumber, action });
                        const { signature, timestamp } = signRequest('POST', path, body, secretKey);

                        const res = await this.helpers.httpRequest({
                            method: 'POST',
                            url: `${baseUrl}${path}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': apiKey,
                                'X-Timestamp': timestamp,
                                'X-Signature': signature,
                                'X-Device-ID': deviceId,
                            },
                            body,
                        });

                        results.push({ json: res, pairedItem: i });
                    }
                }

                // ── Webhook ───────────────────────────────────────────
                if (resource === 'webhook') {

                    if (operation === 'verifySignature') {
                        const rawBody = this.getNodeParameter('rawBody', i) as string;
                        const signature = this.getNodeParameter('signature', i) as string;
                        const timestamp = this.getNodeParameter('timestamp', i) as string;
                        const webhookId = this.getNodeParameter('webhookId', i) as string;

                        const isValid = verifyWebhookSignature(rawBody, signature, webhookId, timestamp, secretKey);

                        if (!isValid) {
                            throw new NodeOperationError(
                                this.getNode(),
                                'Invalid webhook signature',
                                { itemIndex: i },
                            );
                        }

                        results.push({ json: { verified: true, ...items[i].json }, pairedItem: i });
                    }
                }

            } catch (error: any) {
                if (this.continueOnFail()) {
                    results.push({
                        json: { 
                            success: false,
                            error: error.response?.data?.error ?? error.message,
                            code: error.response?.data?.code,
                            statusCode: error.response?.status,
                         },
                        pairedItem: i
                    });
                    continue;
                }
                
                throw new NodeOperationError(
                    this.getNode(),
                    error.response?.data?.error ?? error.message,
                    { 
                        itemIndex: i,
                        description: error.response?.data?.code, // ← kode error muncul sebagai description
                    },
                );
            }
        }

        return [results];
    }
}