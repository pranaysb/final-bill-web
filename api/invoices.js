import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        // GET: Fetch a single invoice by ID
        case 'GET':
            try {
                const { id } = req.query;
                if (!id) return res.status(400).json({ error: 'Invoice ID is required.' });

                const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
                if (error) throw error;
                if (!data) return res.status(404).json({ error: 'Invoice not found.' });

                res.status(200).json(data);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        // POST: Create a new invoice
        case 'POST':
            try {
                const requiredFields = ['invoice_no', 'buyer_address', 'invoice_date', 'quantity', 'total_amount', 'rate', 'taxable_value', 'cgst_amount', 'sgst_amount'];
                for (const field of requiredFields) {
                    if (req.body[field] === undefined) {
                        return res.status(400).json({ error: `Missing required field: ${field}` });
                    }
                }

                const { data, error } = await supabase.from('invoices').insert([req.body]).select('id').single();
                if (error) throw error;

                res.status(201).json(data);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}