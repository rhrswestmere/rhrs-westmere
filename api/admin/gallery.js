import { ok, fail, readBody } from '../_lib/http.js'
import { requireAdmin } from '../_lib/auth.js'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false })

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    const { title, caption, category, image_url, sort_order, is_visible } = body
    if (!title || !image_url) return fail(res, 400, 'title and image_url are required')

    const { data, error } = await supabase
      .from('gallery_photos')
      .insert({
        title,
        caption: caption || '',
        category: category === 'issues' ? 'issues' : 'events',
        image_url,
        sort_order: typeof sort_order === 'number' ? sort_order : null,
        is_visible: is_visible === false ? false : true,
      })
      .select('*')
      .single()

    if (error) return fail(res, 500, error.message)
    return ok(res, data)
  }

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    const { id } = req.query
    if (!id) return fail(res, 400, 'id is required')

    if (req.method === 'PATCH') {
      const body = await readBody(req)
      const patch = {}
      if (body.title !== undefined) patch.title = body.title
      if (body.caption !== undefined) patch.caption = body.caption
      if (body.category !== undefined) patch.category = body.category
      if (body.sort_order !== undefined) patch.sort_order = body.sort_order
      if (body.is_visible !== undefined) patch.is_visible = body.is_visible
      if (Object.keys(patch).length === 0) return fail(res, 400, 'Nothing to update')

      const { data, error } = await supabase
        .from('gallery_photos')
        .update(patch)
        .eq('id', id)
        .select('*')
        .single()

      if (error) return fail(res, 500, error.message)
      return ok(res, data)
    }

    if (req.method === 'DELETE') {
      const { data: photo } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('id', id)
        .single()

      if (photo?.image_url) {
        const path = photo.image_url.split(`/object/public/gallery/`)[1]
        if (path) {
          await supabase.storage.from('gallery').remove([decodeURIComponent(path)])
        }
      }

      const { error } = await supabase.from('gallery_photos').delete().eq('id', id)
      if (error) return fail(res, 500, error.message)
      return ok(res, { success: true })
    }
  }

  return fail(res, 405, 'Method not allowed')
}
