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
export const searchMembers = (token, q) => sendJSON('/api/admin/members', 'POST', { q }, token)
export const assignDesignation = (token, id, payload) => sendJSON(`/api/admin/members/${id}/designation`, 'POST', payload, token)
export const removeDesignation = (token, id) => sendJSON(`/api/admin/members/${id}/designation`, 'DELETE', {}, token)

export const getHelplines = (token) => getJSON('/api/admin/helplines', token)
export const addHelpline = (token, payload) => sendJSON('/api/admin/helplines', 'POST', payload, token)
export const updateHelpline = (token, id, payload) => sendJSON(`/api/admin/helplines?id=${id}`, 'PATCH', payload, token)
export const deleteHelpline = (token, id) => sendJSON(`/api/admin/helplines?id=${id}`, 'DELETE', {}, token)

export async function uploadToSignedUrl(signedUrl, file) {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('Upload failed')
}
