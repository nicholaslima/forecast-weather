import React,{ useEffect,useState  } from 'react';
import { useRouteMatch ,Link} from 'react-router-dom';
import { Container } from './style';
import { FiCloudRain,FiCloudSnow,FiDroplet,FiUmbrella,FiSun,FiArrowLeft } from 'react-icons/fi';

interface paramsType { 
    city: string;
}




interface weatherType{
    descriptions: string[];
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

interface weathersByDate{
    date: Object;
    weathers: weatherType[];
}

const City:React.FC = () => {
    const { params } = useRouteMatch<paramsType>();
    const  [ weatherCity,setWeather ] = useState<cityType>({} as cityType);
    const [ weathersDay,setWeathersDay ] = useState<weatherType[]>([]);
    const [ weathersByDay,setWeathersByday ] =  useState<weathersByDate[]>([]);

    useEffect(() => {
        const weathers = localStorage.getItem('@ForeCastApp:weather');

        if(!weathers){
            return;
        }

        const list = JSON.parse(weathers);

        const found = list.find( (weather:cityType) => 
            weather.name === params.city
        );
        setWeather(found);



    },[setWeather,params.city]);

    

    const date = new Date();

    const dateFormated = new Intl.DateTimeFormat('pt-br').format(date);

    function findWeatherByDate(){
        const listweather = weatherCity.weather.filter( item => {
            const dateParsed = new Date(item.date);
            const atual = new Intl.DateTimeFormat('pt-br').format(dateParsed);
            return atual === dateFormated;
        });
        setWeathersDay(listweather);
    } 

    return(
        <Container>
                <header>
                    <h1>{ params.city }</h1>
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
                        <p>chuva</p>
                    </div>
                </div>
                

            
            <div className="detalhes">
                <div className="item">
                    <p className="title">população</p> 
                    <p>{ weatherCity.population }</p>
                </div>
                
                <div className="item">
                    <p className="title">país</p>
                    <p>{ weatherCity.country }</p>
                </div>

                <div className="item">
                    <p className="title">latitude</p>
                    <p>{ weatherCity.latitude }</p>
                </div>  

                <div className="item">
                    <p className="title">longitude</p>
                    <p>{ weatherCity.longitude }</p>
                </div> 
            </div>
            <ul>
                <div className="header-table">
                    <div>data</div>
                    <div>condições climáticas</div>
                    <div>temperatura</div>
                    <div>humidade</div>
                </div>
                { weatherCity.weather === undefined ? 
                       ( <p>não existem previsões para esta cidade</p> ) 
                 : weatherCity.weather.map( (item:weatherType) => (
                    <li>
                        <div>{ item.date }</div>
                        <div>{ item.descriptions  }</div>
                        <div>{ item.temperature }</div>
                        <div>{ item.humidity }</div>
                    </li>
                ))}
                
            </ul>
        </Container>
    )
}

export default City;