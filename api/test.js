export default function handler(req, res) {
    console.log('TEST API WAS HIT');
    res.status(200).json({ message: 'API is working!', timestamp: new Date().toISOString() });
}