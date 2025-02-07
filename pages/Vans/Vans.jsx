import React from 'react'
import { Link, useSearchParams } from "react-router-dom"
import { getVans } from "../../api"


const Vans = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [vans, setVans] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const typeFilter = searchParams.get("type")
    function handleChange(key, value) {
        console.log(key, value)
        setSearchParams(prev => {

            if (value === null) {
                prev.delete(key)
            }
            else {
                prev.set(key, value)
            }
            console.log(searchParams.toString())
            return prev
        }
        )
    }

    React.useEffect(() => {
        async function loadVans() {
            console.log("inside getVans")
            setLoading(true)
            try {
                const data = await getVans()
                console.log(data)
                setVans(data)
            }
            catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        loadVans()
    }, [])

    const filteredData = typeFilter
        ? vans?.filter(van => (van.type === typeFilter))
        : vans

    const elements = filteredData
        ? filteredData.map(van => (
            <div className="van-tile" key={van.id}>
                <Link to={van.id} state={
                    {
                        search: `?${searchParams.toString()}`,
                        type: typeFilter
                    }
                }>
                    <img src={van.imageUrl} />
                    <div className="van-info">
                        <h3>{van.name}</h3>
                        <p>${van.price} <span>/day</span></p>
                    </div>
                    <i className={`van-type ${van.type} selected`}>{van.type}</i>
                </Link>

            </div>
        ))
        : null

    if (loading) {
        return <h1> Loading....</h1>
    }
    if (error) {
        return <h1> There was an error: {error.message}</h1>
    }

    return (
        <div className="van-list-container">
            <h1>Explore our Van Options</h1>
            <div className="van-list-filter-buttons">
                <button
                    onClick={() => handleChange("type", "simple")}
                    className={`van-type simple ${typeFilter === "simple"? "selected":""}`}>
                    Simple</button>
                <button
                    onClick={() => handleChange("type", "luxury")}
                    className={`van-type luxury ${typeFilter === "luxury"? "selected":""}`}>
                    Luxury</button>
                <button
                    onClick={() => handleChange("type", "rugged")}
                    className={`van-type rugged ${typeFilter === "rugged"? "selected":""}`}>
                    Rugged</button>
           
            {typeFilter ? (
	    <button 
	    onClick={() => handleChange("type", null)} 
	    className="van-type clear-filters"
	    >Clear Filter</button>) : null}
	    
             </div>
	     <div className="van-list">
                {elements}
            </div>
        </div>
    )
}

export default Vans