import style from './features.module.css';

const Features = () => {
    return (
        <div className={`${style.features} bg-light py-5`}>
            <div className='container'>
            <h2 className="text-center fw-medium mb-4">مزاد عربيتي</h2>
                <div className='row'>
                    <div className='col-xl-4 col-lg-4 col-md-12 col-12'>
                        <div className={`${style.image} shadow-sm my-2 rounded-4 overflow-hidden`}>
                            <img alt="image" src="./f1.png"/>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-12 col-12'>
                        <div className={`${style.image} shadow-sm my-2 rounded-4 overflow-hidden`}>
                            <img alt="image" src="./f2.png"/>
                        </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-12 col-12'>
                        <div className={`${style.image} shadow-sm my-2 rounded-4 overflow-hidden`}>
                            <img alt="image" src="./f3.png"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;