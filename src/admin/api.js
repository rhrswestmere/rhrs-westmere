import { getJSON, postJSON, sendJSON } from '../lib/api'

export function login(username, password) {
  return postJSON('/api/login', { username, password })
}

export const getGallery = (token) => getJSON('/api/admin/gallery', token)
export const addGalleryPhoto = (token, payload) => sendJSON('/api/admin/gallery', 'POST', payload, token)
export const updateGalleryPhoto = (token, id, payload) => sendJSON(`/api/admin/gallery?id=${id}`, 'PATCH', payload, token)
export const deleteGalleryPhoto = (token, id) => sendJSON(`/api/admin/gallery?id=${id}`, 'DELETE', {}, token)
export const getUploadUrl = (token, filename) => sendJSON('/api/admin/upload-url', 'POST', { filename }, token)
export const getRecords = (token) => getJSON('/api/admin/records', token)
export const searchMembers = (token, q, page, limit, from, to) => sendJSON('/api/admin/members', 'POST', { q, page, limit, from, to }, token)
export const assignDesignation = (token, id, payload) => sendJSON(`/api/admin/members/${id}/designation`, 'POST', payload, token)
export const removeDesignation = (token, id) => sendJSON(`/api/admin/members/${id}/designation`, 'DELETE', {}, token)
export const toggleMemberStatus = (token, id, isActive) => sendJSON(`/api/admin/members/${id}/designation`, 'PATCH', { action: 'status', is_active: isActive }, token)
export const deleteMember = (token, id) => sendJSON(`/api/admin/members/${id}/designation`, 'DELETE', { action: 'status' }, token)
export const editMember = (token, id, payload) => sendJSON(`/api/admin/members/${id}/designation`, 'PATCH', { action: 'edit', ...payload }, token)

export const getHelplines = (token) => getJSON('/api/admin/helplines', token)
export const addHelpline = (token, payload) => sendJSON('/api/admin/helplines', 'POST', payload, token)
export const updateHelpline = (token, id, payload) => sendJSON(`/api/admin/helplines?id=${id}`, 'PATCH', payload, token)
export const deleteHelpline = (token, id) => sendJSON(`/api/admin/helplines?id=${id}`, 'DELETE', {}, token)

export const getReport = (token, type, from, to, page, limit) => sendJSON('/api/admin/records', 'POST', { type, from, to, page, limit }, token)

export const getRequests = (token) => sendJSON('/api/admin/records', 'POST', { type: 'requests' }, token)
export const approveRequest = (token, memberId, paymentId) => sendJSON(`/api/admin/members/${memberId}/designation`, 'PATCH', { action: 'approve_request', payment_id: paymentId }, token)
export const rejectRequest = (token, paymentId) => sendJSON('/api/admin/records', 'PATCH', { action: 'reject', id: paymentId }, token)

export async function uploadToSignedUrl(signedUrl, file) {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('Upload failed')
}
