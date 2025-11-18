import { publicAxios } from "../utils/axios";

export async function fetchHeroSection() {
    // Simulate an API call to fetch the hero section data
    try{
        const response = await publicAxios.get('/herosection');
        return response.data;
    }catch{
        throw new Error('Failed to fetch hero section');
    }
}

export async function updateHeroSection(data : {title: string, description_one: string, description_two: string}) {
    // Simulate an API call to update the hero section data
    try{
        const response = await publicAxios.put('/herosection', data);
        return response.data;
    }catch{
        throw new Error('Failed to update hero section');
    }
}