import React,{ useEffect,useState,useCallback  } from 'react';
import { useRouteMatch ,Link} from 'react-router-dom';
import { Container } from './style';
import api from '../../service/api';
import { cityCurrentType,iconWheather } from '../home';

import {
    FiArrowLeft,
} from 'react-icons/fi';


interface paramsType { 
    city: string;
}

interface weatherType{
    description: string[];
    humidity: string;
    temp: number;
    temp_max: number;
    hour: string;
    minutes: string;
    temp_min: number;
    sea_level: number;
    dateFormated: string;
    deg: number;
    speed: number;
}

interface cityType{
    name: string;
    id: string;
    lat: string;
    lon: string;
    population: string;
    country: string;
    weathersDate: Array<weathersByDate>;
}

interface weathersByDate{
    date: string;
    weathers: weatherType[];
}

const City:React.FC = () => {
    const { params } = useRouteMatch<paramsType>();
    const [ cityDatas,setCityDatas ] = useState<cityType>({} as cityType);
    const [ weatherdates,setWeatherDates ] = useState<weathersByDate[]>([] as weathersByDate[]);
    const [ currentWeather, setCurrentWeather ] = useState<cityCurrentType>({} as cityCurrentType);
        
    
    const date = new Date();
    const dateFormated = new Intl.DateTimeFormat('pt-br').format(date);

    const captWeatherData = useCallback((listWeather: any) => {
        const list =  listWeather.map( (item: any)  => {
             const { speed,deg } = item.wind;
             const  description  = item.weather[0].description;
             const { humidity,temp,temp_max,temp_min,pressure,sea_level } = item.main;
             const date = item.dt_txt;
 
             const temp_converted = convertToCelsius(temp);
             const temp_max_converted = convertToCelsius(temp_max);
             const temp_min_converted = convertToCelsius(temp_min);
             const humidityFormated = Intl.NumberFormat('pt-br',{ style: "percent" }).format(humidity / 100);
             const dateConverted = new Date(date);
             const hour = dateConverted.getHours();
             const minutes = dateConverted.getMinutes();
 
             const dateFormated = Intl.DateTimeFormat('pt-br').format(dateConverted);
             
                     
             return { 
                 hour,
                 minutes,
                 dateFormated,
                 description,
                 humidity: humidityFormated,
                 temp: temp_converted,
                 temp_max: temp_max_converted,
                 temp_min: temp_min_converted,
                 pressure,
                 sea_level,
                 speed,
                 deg 
             }
         });
 
         return list;
     },[]);


    const formatDatas = useCallback( (datas: any) => {
        const { name,population,country,id }  = datas.city;
        const { lat,lon }  = datas.city.coord;
        const listWeather = datas.list;

        const weathers = captWeatherData(listWeather);

        const populationFormated =  Intl.NumberFormat('pt-br').format(population);

        const weathersDate = listByDate(weathers);

        const newcity: cityType = { 
            name,
            population:populationFormated,
            country,
            id,
            lat,
            lon,
            weathersDate 
        }
 
        setCityDatas(newcity);

        return newcity;
    },[captWeatherData]);

    


    const findCurrentWeather = useCallback( () => {
        const listCurrentWeatherString = localStorage.getItem('@ForeCastApp:weather');

        if(!listCurrentWeatherString){
            return;
        }
                
        const listCurrentWeather = JSON.parse(listCurrentWeatherString);
                
        const cityCurrentWeather = listCurrentWeather.find( (item:any) => {
            return item.name ===  params.city;
        });

        setCurrentWeather(cityCurrentWeather);
    },[params.city]);

    useEffect( () => {
            api.get(`/forecast?q=${params.city}`,{ 
                headers: { 
                    "x-rapidapi-key":`${ process.env.REACT_APP_APIKEY }`,
                }
            }).then(response => {
                const datas = response.data;
                formatDatas(datas);  
                findCurrentWeather();
            });
    },[params.city,findCurrentWeather,formatDatas]);

    

    

    function convertToCelsius(kelvin: number){
        const celcius = kelvin - 273.15;
        const formated = new Intl.NumberFormat('pt-br').format(celcius);

        return `${ formated } C°`;
    }


    function listByDate(weathers: any){

        const dates: string[] = [];

        weathers.forEach( (item: weatherType) => {
   
            const date = item.dateFormated;    
            const exist = dates.includes(date);

            if(exist){
                return;
            }

            dates.push(date);
        })

        const weatherdates: weathersByDate[] = dates.map( date => {
            const list = weathers.filter( (weather: weatherType) => weather.dateFormated === date);

            return { 
                date: date,
                weathers: list
            }
        });

        setWeatherDates(weatherdates);
        return weatherdates;
    }


    return(
        <Container>
                <header>
                    <h1>{ cityDatas.name }</h1>
                    <Link to="/" className="btn">
                        <FiArrowLeft color="#fff" size="20"></FiArrowLeft>
                    </Link>
                </header>
                <div className="list">
                    <div className="item">
                        {  
                            currentWeather.weather &&   iconWheather[ currentWeather.weather.description ]
                        }
                    </div>
                    <div className="item">
                        <p className="title">Data</p> 
                        <p>{ dateFormated }</p>
                    </div>
                    <div className="item">
                        <p className="title">condições climáticas</p> 
                        <p>{ currentWeather.weather && currentWeather.weather.description  }</p>
                    </div>
                </div>
                

            
            <div className="detalhes">
                <div className="item">
                    <p className="title">população</p> 
                    <p>{ cityDatas.population }</p>
                </div>
                
                <div className="item">
                    <p className="title">país</p>
                    <p>{ cityDatas.country }</p>
                </div>

                <div className="item">
                    <p className="title">latitude</p>
                    <p>{ cityDatas.lat }</p>
                </div>  

                <div className="item">
                    <p className="title">longitude</p>
                    <p>{ cityDatas.lon }</p>
                </div> 
            </div>
            <ul>
                { weatherdates === undefined ? 
                       ( <p>não existem previsões para esta cidade</p> ) 
                 : weatherdates.map( (item: weathersByDate) => (
                    <li>
                        <div className="listWheather" key={ item.date }>
                            <p>{ item.date }</p>
                            <div className="headerWheaters">
                                    <p className="titleItem">horas</p>
                                    <p className="titleItem">condições</p>
                                    <p className="titleItem">temperatura</p>
                                    <p className="titleItem">max</p>
                                    <p className="titleItem">min</p>
                                    <p className="titleItem">humidade</p>
                            </div>
                            { item.weathers.map( (weather:weatherType ) => (
                                <div className="itemWheather" key={ weather.hour }>
                                        <p className="valueItem">{`${ weather.hour } horas`}</p>
                                        <p className="valueItem">{ weather.description }</p>
                                        <p className="valueItem">{ weather.temp }</p>
                                        <p className="valueItem">{ weather.temp_max }</p>
                                        <p className="valueItem">{ weather.temp_min }</p>
                                        <p className="valueItem">{ weather.humidity }</p>
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
                
            </ul>
        </Container>
    )
}

export default City;