import React from 'react'
import { Link, useLocation, useParams } from "react-router-dom"
import { getVans } from "../../api"

const VanDetail = () => {
    const [error, setError] = React.useState(null)
    const [van, setVan] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const {id} = useParams()
    const location = useLocation()

    React.useState(() => {
        async function loadVanDetails() {
            console.log("inside Load Vans Details", id)
            setLoading(true)
            try {
                const data = await getVans(id)
                console.log(data)
                setVan(data)
            }
            catch (err) {
                setError(err)
            }
            finally {
                setLoading(false)
            }
        }
        loadVanDetails()
    }, [id])

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (error) {
        return <h1>There was an error: {error.message}</h1>
    }

    const search = location.state?.search || ""
    const type = location.state?.type || "all"

    return (
        
        <div className="van-detail-container">
        <Link to={`..${search}`} relative="path"  className="back-button"
        >&larr; <span> Back to {type} vans</span>
        </Link>
        {
            van && 
            (<div className="van-detail">
                <img src={van.imageUrl}/>
                <i className={`van-type ${van.type} selected`}>
                        {van.type}
                </i>
                <h2>{van.name}</h2>
                <p className="van-price"><span>${van.price}</span>/day</p>
                <h3>{van.description}</h3>   
                <button  className="link-button">Rent this Van</button>             
                </div>
            )
        }
        </div>
    )
}
export default VanDetail