import styled from 'styled-components';


export const Container = styled.div`
    height: 100Vh;
    margin: 0 auto;


    .title{
        font-size: 20px;
        font-weight: 600;
        text-transform: capitalize;
        color: white;
        
    }

    .buttonRefresh{
        color: #8257E5;
        float: right;
        cursor: pointer;
    }

    header{
        margin-top: 50px;
        margin-bottom: 15px;
    }

    button{
        color: #fff;
        background-color: #04d361;
        padding: 16px 20px;
        font-size: 20px;
        text-transform: capitalize;
        font-weight: 600;
        border-radius: 0px 7px 7px 0px;
        border-width: 0px;
    }

    .header-weather{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .weather-temp{
        display: flex;
        flex-direction: column;
        margin-left: 15px;
    }

    .temps{
        display: flex;
        flex-direction: row;
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .temp{
        font-weight: 600;
        font-size: 60px;
        text-align: center;
        margin-left: 15px;
    }

    ul{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
        list-style-type: none;
    }

    
    li{
        background-color: white;
        border-radius: 7px;
        padding: 50px;
        list-style-type: none;
        box-shadow: 5px 5px 20px #5D6970;
        margin-top: 15px;
        .cidade{
            font-size: 28px;
            font-weight: 600;
        }

        .condicoes{
            font-size: 25px;
            font-weight: 600;
            color: black;
            text-transform: capitalize;
            text-align: center;
        }
        .data{
            font-weight: 100;
            float: right;
        }

        .max,.min{
            font-weight: 100;
        }

        a{
            display: block;
            color: white;
            width: 100%;
            text-align: center;
            padding: 10px;
            background-color: #8257E5;
            border-radius: 7px;
            margin-top: 25px;
            text-transform: capitalize;
        }
    }

`;