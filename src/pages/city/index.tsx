import React,{ useEffect,useState  } from 'react';
import { useRouteMatch ,Link} from 'react-router-dom';
import { Container } from './style';
import api from '../../service/api';

import { FiSun,FiArrowLeft } from 'react-icons/fi';

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
    population: number;
    country: string;
    weathersDate: Array<weathersByDate>;
}

interface weathersByDate{
    date: Object;
    weathers: weatherType[];
}

const City:React.FC = () => {
    const { params } = useRouteMatch<paramsType>();
    const [ cityDatas,setCityDatas ] = useState<cityType>({} as cityType);
    const [ weatherdates,setWeatherDates ] = useState<weathersByDate[]>([] as weathersByDate[]);
    const [ currentWeather, setCurrentWeather ] = useState<weatherType>({} as weatherType);
        
    
    const date = new Date();
    const hour = date.getHours();

    const hourString = String(hour);
    const dateFormated = new Intl.DateTimeFormat('pt-br').format(date);

    useEffect( () => {
            api.get(`/forecast?q=${params.city}`,{ 
                headers: { 
                    "x-rapidapi-key": "e257bac6d4msh21e07a47b5b0f42p16acb9jsn8d167ba3a5d6",
                }
            }).then(response => {
                const datas = response.data;
                const city:cityType = formatDatas(datas);  
                findWeatherFromDate(city);
            });
    },[params.city]);

    function findWeatherFromDate(city: cityType){
        const found = city.weathersDate.find( item => {
            return item.date === dateFormated;
        });

        if(!found){
            return;
        };

        const weather = found.weathers.find( item => {
            return item.hour === hourString;
        });

        if(!weather){
            return;
        }
        console.log(found);
        setCurrentWeather(weather);
    }
    

    function formatDatas(datas: any){
        const { name,population,country,id }  = datas.city;
        const { lat,lon }  = datas.city.coord;
        const listWeather = datas.list;

        const weathers = listWeather.map( (item: any)  => {
            const { speed,deg } = item.wind;
            const  description  = item.weather[0].description;
            const { humidity,temp,temp_max,temp_min,pressure,sea_level } = item.main;
            const date = item.dt_txt;

            const temp_converted = convertToCelsius(temp);
            const temp_max_converted = convertToCelsius(temp_max);
            const temp_min_converted = convertToCelsius(temp_min);

            const dateConverted = new Date(date);
            const hour = dateConverted.getHours();
            const minutes = dateConverted.getMinutes();

            const dateFormated = Intl.DateTimeFormat('pt-br').format(dateConverted);
        
                    
            return { 
                hour,
                minutes,
                dateFormated,
                description,
                humidity,
                temp: temp_converted,
                temp_max: temp_max_converted,
                temp_min: temp_min_converted,
                pressure,
                sea_level,
                speed,
                deg 
            }
        });

        const city: any  = { name,population,country,id,lat,lon,weathers  } 

        const weathersDate = listByDate(city);

        const newcity: cityType = { name,population,country,id,lat,lon,weathersDate }
 
        setCityDatas(newcity);

        return newcity;
    }

    function convertToCelsius(kelvin: number){
        const celcius = kelvin - 273.15;
        const formated = new Intl.NumberFormat('pt-br').format(celcius);

        return `${ formated } C°`;
    }


    function listByDate(city: any){

        const dates: string[] = [];

        city.weathers.map( (item: weatherType) => {
   
            const date = item.dateFormated;    
            const exist = dates.includes(date);

            if(exist){
                return;
            }

            dates.push(date);
        })

        const weatherdates: weathersByDate[] = dates.map( date => {
            const list = city.weathers.filter( (weather: weatherType) => weather.dateFormated === date);

            return { 
                date: date,
                weathers: list
            }
        })

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
                        <FiSun color="#F0DD32" size="51"></FiSun>
                    </div>
                    <div className="item">
                        <p className="title">Data</p> 
                        <p>{ dateFormated }</p>
                    </div>
                    <div className="item">
                        <p className="title">condições climáticas</p> 
                        <p>{ currentWeather.description }</p>
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
                        <div className="listWheather">
                            <p>{ item.date }</p>
                            <div className="headerWheaters">
                                    <p className="titleItem">horas</p>
                                    <p className="titleItem">condições</p>
                                    <p className="titleItem">temperatura</p>
                                    <p className="titleItem">max</p>
                                    <p className="titleItem">min</p>
                                    <p className="titleItem">humidade</p>
                            </div>
                            { item.weathers.map( (weather:weatherType )=> (
                                <div className="itemWheather">
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