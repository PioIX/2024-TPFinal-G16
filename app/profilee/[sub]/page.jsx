"use client"; // Marcar como componente cliente para permitir el uso de hooks

import React from 'react';
import { useParams } from 'next/navigation';
import ProfilePage from '../../../components/ProfilePage'; // Ajusta la ruta según dónde esté ubicado el componente

const UserProfilePage = () => {
    const params = useParams();
    const sub = params?.sub;
    let modifiedSub = sub.replace("%7C", "|");

    // Imprime el valor del sub para verificar que se captura correctamente
    console.log('Received sub:', sub);

    // Maneja el caso en el que el sub no esté disponible
    if (!sub) {
        return <div>No valid parameter found.</div>;
    }

    return (
        // Reutilizar el componente ProfilePage y pasar el sub como prop
        <ProfilePage sub={modifiedSub} />
    );
};

export default UserProfilePage;
