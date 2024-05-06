import React, {useEffect, useState} from "react";
import {Route, Routes} from "react-router";
import {BrowserRouter} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import callApi from "./utility/apiCaller.js";
import Loader from "./components/Loader.jsx";

function App() {
    // const [isLoading, setIsLoading] = useState(true);
    //
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 800);
    //
    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <BrowserRouter>
            {/*{isLoading ? <Loader /> : null}*/}
            <Routes>
                <Route path={'/'} element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
