import { Icon, ICredentialType, INodeProperties } from "n8n-workflow";

export class WaberesApi implements ICredentialType {
    name = 'waberesApi';
    displayName = 'WABeres API';
    icon?: Icon | undefined = "file:waberes.svg";
    documentationUrl?: string | undefined = "https://waberes.mintlify.app";
    properties: INodeProperties[] = [
        { displayName: 'API Key', name: 'apiKey', type: 'string', typeOptions: { password: true }, default: '' },
        { displayName: 'Secret Key', name: 'secretKey', type: 'string', typeOptions: { password: true }, default: '' },
        { displayName: 'Base URL', name: 'baseUrl', type: 'string', default: 'https://waberes.fredoronan.web.id' }
    ];
}