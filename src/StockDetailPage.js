import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
const StockDetailPage = ({URL}) => {
    const { id } = useParams(); // Get the id from the URL
    const [stockDetails, setStockDetails] = useState(null);

    useEffect(() => {
        axios
            .get(`${URL}${id}`)
            .then((response) => {
                setStockDetails(response.data);
            })
            .catch((err) => {
                alert(err);
            });
    }, [id]);

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${URL}${id}/`, stockDetails, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("Stock details updated successfully!");
            setStockDetails(response.data);
        } catch (err) {
            alert(err);
        }
    };

    const handleChange = (e) => {
        setStockDetails({
            ...stockDetails,
            [e.target.name]: e.target.value,

        });
    };

    return (
        <div className="App">
            <h2 className='App-header'>Stock Details for ID: {id}</h2>
            {stockDetails ? (
                <div className='container'>
                    
                    <div className='form_background'>
                        <form className='detail_form' onSubmit={handleEdit}>
                            <div className='row'>
                                <div className='col col-3'><label>Date</label></div>
                                <div className='col col-9'><input name='date' value={stockDetails.date} onChange={handleChange} /></div>
                            </div>
                            <div className='row'>
                                <div className='col col-3'><label>Trade Code</label></div>
                                <div className='col col-9'><input name='trade_code' value={stockDetails.trade_code} onChange={handleChange} /></div>
                            </div>
                            <div className='row'>
                                <div className='col col-3'><label>High</label></div>
                                <div className='col col-9'><input name='high' value={stockDetails.high} onChange={handleChange} /></div>
                            </div>
                            <div className='row'>
                                <div className='col col-3'><label>Low</label></div>
                                <div className='col col-9'><input name='low' value={stockDetails.low} onChange={handleChange} /></div>
                            </div>
                            <div className='row'>
                                <div className='col col-3'><label>Open</label></div>
                                <div className='col col-9'><input name='open' value={stockDetails.open} onChange={handleChange} /></div>
                            </div>
                            <div className='row'>
                                <div className='col col-3'><label>Close</label></div>
                                <div className='col col-9'><input name='close' value={stockDetails.close} onChange={handleChange} /></div>
                            </div>
                            <div className='row'>
                                <div className='col col-3'><label>Volume</label></div>
                                <div className='col col-9'><input name='volume' value={stockDetails.volume} onChange={handleChange} /></div>
                            </div>


                            <button type='submit' className='btn btn-success'>Save</button>
                        </form>
                    </div>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default StockDetailPage;
