import { base44 } from '../api/base44Client';

export const agentSDK = {
    getConversation: (id) => base44.agents.getConversation(id),
    subscribeToConversation: (id, cb) => base44.agents.subscribeToConversation(id, cb),
    addMessage: (convo, data) => base44.agents.addMessage(convo, data),
    listConversations: (params) => base44.agents.listConversations(params),
    createConversation: (data) => base44.agents.createConversation(data),
    getWhatsAppConnectURL: (name) => base44.agents.getWhatsAppConnectURL(name),
};
