export default async function handler(req, res) {
    try {
        // Redirige la solicitud al servidor externo
        const response = await fetch('http://localhost:4000/api/profile', {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: req.headers.authorization, // Pasa el token del cliente
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined, // Incluye el cuerpo solo si es necesario
        });

        // Reenvía la respuesta del servidor externo al cliente
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error in proxy route for /api/profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
