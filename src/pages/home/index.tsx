

import React,{ useState,useRef } from 'react';
import { Container } from './style';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import Message,{ refMessage } from '../../components/message';



interface descritionType{
    description: string
}

interface weatherType{
    descriptions: Array<descritionType>;
    humidity: string;
    temperature: number;
    temperature_max: number;
    temperature_min: number;
    sea_level: number;
    date: Date;
    wind: {
        deg: number;
        speed: number;
    }
}

interface cityType{
    name: string;
    latitude: string;
    longitude: string;
    population: number;
    country: string;
    weather: Array<weatherType>;
}



const Home: React.FC = () => {
    const [ cidade,setCidade ] = useState('');
    const [ message ,setMessage ] = useState('');
    const [ ForecastList ,setForecast ] = useState<cityType[]>(() => {

       const weathers = localStorage.getItem(`@ForeCastApp:weather`);

       if(weathers){
           return JSON.parse(weathers);
       }

       return [] as Array<weatherType>;
    }); 

    const messageRef = useRef<refMessage>(null);

    async function buscar(){
        const regex = /\w*,\w{2}$/;
        const validation = regex.test(cidade);

        if(!validation){
            setMessage('digite o nome da cidade sem acento, sigla do pais');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
            return;
        }
        try{ 
            await api.get(`/forecast?q=${ cidade }`,{

                headers:{ 
                     "x-rapidapi-key": "e257bac6d4msh21e07a47b5b0f42p16acb9jsn8d167ba3a5d6",
                 },

             }).then(response => {

                const listResponse = response.data.list;
                let weatherList:weatherType[] = [];

                const { country,name,population,coord } = response.data.city;
                const { lat, lon } = coord;

                listResponse.forEach( (weather: any) => {

                   const { temp,humidity,temp_min,temp_max,sea_level } =  weather.main;

                   const descriptions = weather.weather.map((item: any) => item.description);

                   const { speed,deg } = weather.wind;
                   const date = weather.dt_txt;

                   const weatherItem = {
                        descriptions,
                        humidity,
                        temperature: temp,
                        temperature_max: temp_max,
                        temperature_min: temp_min,
                        sea_level,
                        date,
                        wind: {
                            deg,
                            speed,
                        }
                    }
                    weatherList.push(weatherItem);
                });

                const city: cityType = {
                    name,
                    population,
                    country,
                    latitude: lat,
                    longitude: lon,
                    weather: weatherList
                }

                const list = ForecastList;
                list.push(city);

                
                if(ForecastList) {
                    setForecast(list);
                    localStorage.setItem(`@ForeCastApp:weather`,JSON.stringify(list));
                    return;
                }
                setForecast(list);
                localStorage.setItem(`@ForeCastApp:weather`,JSON.stringify(list));
             });

        }catch(err){
            setMessage('erro tente novamente');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
        }
        
    }

    return(
        <Container>
            <header>
                <h1>Previsão do tempo</h1>
                <input type="text" value={ cidade } onChange={ e => setCidade(e.target.value) } placeholder="cidade, pais" />
                <button onClick={ buscar }>buscar</button>
            </header>
            

            <Message ref={ messageRef }>{ message }</Message>

            <ul>
                <div className="header-table">
                    <div>cidade</div>
                    <div>Pais</div>
                    <div>População</div>
                    <div>data</div>
                    <div>temperatura</div>
                    <div>Humidade do ar</div>
                </div>
                { ForecastList.map( forecast => (
                    <li key={ forecast.name }>
                        <div>{ forecast.name }</div>
                        <div>{ forecast.country }</div>
                        <div>{ forecast.population }</div>
                        <div>{ forecast.weather[0].date }</div>
                        <div>{ forecast.weather[0].temperature }</div>
                        <div>{ forecast.weather[0].humidity }</div>
                        <Link to={ `/city/${ forecast.name  }`} >mais detalhes</Link>
                    </li>
                ))}
            </ul>

        </Container>
    )
}

export default Home;