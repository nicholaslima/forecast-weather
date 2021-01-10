

import React,{ useState,useRef } from 'react';
import { Container } from './style';
import { Link } from 'react-router-dom';
import api from '../../service/api';
import Message,{ refMessage } from '../../components/message';

import {
    FiDroplet,
    FiSun,
    FiArrowRight,
    FiRefreshCw,
    FiCloud,
    FiCloudOff,
    FiCloudRain,
} from 'react-icons/fi';




 export interface weatherCurrentType{
    description: 'broken clouds' | 'overcast clouds' | 'clear sky' | 'scattered clouds' | 'few clouds' | 'shower rain' | 'heavy intensity rain' | 'moderate rain';
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

export interface cityCurrentType{
    name: string;
    latitude: string;
    longitude: string;
    country: string;
    weather: weatherCurrentType;
}

export const iconWheather = {
    'broken clouds': <FiCloud color="#0077b6" size="50"></FiCloud>,
    'overcast clouds': <FiCloud color="#3f88c5" size="50"></FiCloud>,
    'clear sky': <FiSun color="#fee440" size="50"></FiSun>,
    'light rain': <FiDroplet color="#a8dadc" size="50"></FiDroplet>,
    'scattered clouds': <FiCloudOff color="#3f88c5" size="50"></FiCloudOff>,
    'few clouds': <FiCloudOff color="#a8dadc" size="50"></FiCloudOff>,
    'shower rain': <FiDroplet color="#a8dadc" size="50"></FiDroplet>,
    'heavy intensity rain': <FiCloudRain color="#3f88c5" size="50"></FiCloudRain>,
    'moderate rain': <FiCloudRain color="#a8dadc" size="50"></FiCloudRain>,
}



const Home: React.FC = () => {
    const [ cidade,setCidade ] = useState('');
    const [ message ,setMessage ] = useState('');
    const [ ForecastList ,setForecast ] = useState<cityCurrentType[]>(() => {

       const weathers = localStorage.getItem(`@ForeCastApp:weather`);

       if(weathers){
           return JSON.parse(weathers);
       }

       return [] as Array<weatherCurrentType>;
    }); 





    const messageRef = useRef<refMessage>(null);

    async function buscar(){
        const cityVality = validationCity();
        const ExistCity = cityExist();

        if(cityVality === false || ExistCity === false){
            return false;
        }

        try{ 
            await api.get(`/weather?q=${ cidade }`,{

                headers:{ 
                     "x-rapidapi-key":`${ process.env.REACT_APP_APIKEY }`,
                 },

             }).then(response => {
                const datas = response.data;
                

                const city = captureData(datas);
                const list = [ ...ForecastList,city];
                setForecast(list);
                setCidade('');
                saveLocalStorage(list);
             });
        } catch(err){
            setMessage('erro tente novamente');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
            console.log(err);
            setCidade('');
        }
    }

    function captureData(datas: any){

        const description = datas.weather[0].description;
        const { name } = datas;
        const { lon,lat} = datas.coord;
        const { speed,deg } = datas.wind;
        const { country } = datas.sys;
        const { temp,temp_max,temp_min,humidity } = datas.main;

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

        const city: cityCurrentType = {
            name,
            country,
            latitude: lat,
            longitude: lon,
            weather: weatherItem
        }

        return city;
    }

    function cityExist(){
        const [city,] = cidade.split(',');
        const cityWithoutAccents = removeAcento(city);

        const cityExist = ForecastList.find( forecast => {
            const cityConverted = removeAcento(forecast.name);
            return cityConverted === cityWithoutAccents;
        });

        if(cityExist){
            setMessage('esta cidade já existe na sua lista');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
            setCidade('');
            return false;
        }
        return true;
    }

    async function updateCity(city: string,pais: string){
        const response = await api.get(`/weather?q=${ city },${ pais }`,{
            headers:{ 
                "x-rapidapi-key": "e257bac6d4msh21e07a47b5b0f42p16acb9jsn8d167ba3a5d6",
            },
        });

       const data = await response.data;
       const newCity = captureData(data);

       const index = ForecastList.findIndex( forecast => forecast.name === city);
       ForecastList[index] = newCity;
       setForecast([...ForecastList]);

       saveLocalStorage(ForecastList);
    }

    function saveLocalStorage(list: Object[]){
        const listString = JSON.stringify(list);
        localStorage.setItem('@ForeCastApp:weather',listString);
    }

    function validationCity(){
        const regex = /\w*,\w{2}$/;
        const validation = regex.test(cidade);

        if(!validation){
            setMessage('digite o nome da cidade sem acento, sigla do pais');
            messageRef.current?.ativar();
            messageRef.current?.closeMessage();
            setCidade('');
            return false;
        }

        return true
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
                        <FiRefreshCw onClick={ () => updateCity(forecast.name,forecast.country) } className="buttonRefresh" ></FiRefreshCw>
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