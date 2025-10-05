import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        // GET: Fetch all addresses
        case 'GET':
            try {
                const { data, error } = await supabase.from('addresses').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        // POST: Create a new address
        case 'POST':
            try {
                const { name, address_text, gst_number } = req.body;
                if (!name || !address_text) {
                    return res.status(400).json({ error: 'Name and address text are required.' });
                }
                const { data, error } = await supabase.from('addresses').insert([{ name, address_text, gst_number }]).select();
                if (error) throw error;
                res.status(201).json(data[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        // DELETE: Remove an address
        case 'DELETE':
            try {
                if (!id) return res.status(400).json({ error: 'Address ID is required.' });
                const { error } = await supabase.from('addresses').delete().match({ id });
                if (error) throw error;
                res.status(204).send(); // No Content
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}