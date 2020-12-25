

import React,{ useState,useRef, useEffect } from 'react';
import { Container } from './style';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import Message,{ refMessage } from '../../components/message';
import { FiCloudRain,
    FiCloudSnow,
    FiDroplet,
    FiSun,
    FiArrowRight,
    FiRefreshCw,
    FiCloud,
    FiCloudLightning,
    FiCloudDrizzle
} from 'react-icons/fi';




interface weatherType{
    description: 'broken clouds' | 'overcast clouds' | 'clear Sky';
    humidity: string;
    temperature: string;
    temperature_max: string;
    temperature_min: string;
    date: string;
    hour: Number;
    wind: {
        deg: number;
        speed: number;
    }
}

interface cityType{
    name: string;
    latitude: string;
    longitude: string;
    country: string;
    weather: weatherType;
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
            setCidade('');
            return;
        }

        const [city,] = cidade.split(',');

        const cityExist = ForecastList.find( forecast => {
            const cityConverted = removeAcento(forecast.name);
            return cityConverted === city
        });

        if(cityExist){
            setMessage('esta cidade já existe na sua lista');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
            setCidade('');
            return;
        }

        try{ 
            await api.get(`/weather?q=${ cidade }`,{

                headers:{ 
                     "x-rapidapi-key": "e257bac6d4msh21e07a47b5b0f42p16acb9jsn8d167ba3a5d6",
                 },

             }).then(response => {

                const description = response.data.weather[0].description;
                const { name } = response.data;
                const { lon,lat} = response.data.coord;
                const { speed,deg } = response.data.wind;
                const { country } = response.data.sys;
                const { temp,temp_max,temp_min,humidity } = response.data.main;

                const currentyDate =  new Date();
                const currentyDateFormated = new Intl.DateTimeFormat('pt-br').format(currentyDate);
                const hour = currentyDate.getHours();

                
                const weatherItem = {
                    description,
                    humidity,
                    temperature: convertToCelsius(temp),
                    temperature_max: convertToCelsius(temp_max),
                    temperature_min: convertToCelsius(temp_min),
                    date: currentyDateFormated,
                    hour,
                    wind: {
                        deg,
                        speed,
                    }
                }

                const city: cityType = {
                    name,
                    country,
                    latitude: lat,
                    longitude: lon,
                    weather: weatherItem
                }
                const list = [ ...ForecastList,city];
                setForecast(list);
                setCidade('');
                localStorage.setItem(`@ForeCastApp:weather`,JSON.stringify(list));
             });

        } catch(err){
            setMessage('erro tente novamente');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
            setCidade('');
        }
    }


    function removeAcento(text: string)
    {       
        text = text.toLowerCase();                                                         
        text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
        text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
        text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
        text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
        text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
        text = text.replace(new RegExp('[Ç]','gi'), 'c');
        return text;                 
    }


    function convertToCelsius(kelvin: number){
        const celcius = kelvin - 273.15;
        const fomated = new Intl.NumberFormat('pt-br').format(celcius);

        return fomated;
    }

    const iconWheather = {
        'broken clouds': <FiCloud color="#0077b6" size="50"></FiCloud>,
        'overcast clouds': <FiCloud color="#3f88c5" size="50"></FiCloud>,
        'clear Sky': <FiSun color="#fee440" size="80"></FiSun>,
        'light rain': <FiDroplet color="#3f88c5" size="50"></FiDroplet>,
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
                { ForecastList.map( forecast => (
                    <li key={ forecast.name }>
                        <FiRefreshCw color="#8257E5" style={{ float: 'right' }}></FiRefreshCw>
                        <div className="header-weather">
                            <div className="cidade">{  forecast.name  } </div>
                            <div>{ forecast.country }</div>
                        </div>

                        <div className="temps">
                            {  
                                iconWheather[forecast.weather.description]
                            }
                            <div className="temp">{ forecast.weather.temperature_min +` C°`  } </div>
                            <div className="weather-temp">
                                <div className="max">max { forecast.weather.temperature_max +` C°` }  </div>
                                <div className="min">min { forecast.weather.temperature_min +` C°`  } </div>
                            </div>
                        </div>
                        

                        <p className="condicoes">{  forecast.weather.description }</p>
                        <p className="data">{ forecast.weather.date }</p>
                        <Link to={ `/city/${ forecast.name  }`} >mais detalhes<FiArrowRight style={{ marginLeft: '12px'}}></FiArrowRight></Link>
                    </li>
                ))}
            </ul>

        </Container>
    )
}

export default Home;