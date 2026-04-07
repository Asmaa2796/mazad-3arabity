import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../../../shared/i18n/LanguageProvider';
import { fetchBrands } from '../../../Redux/Slices/contentSlice';
import { fetchCountries, fetchGovernorates } from '../../../Redux/Slices/auctionsSlice';
import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Select from 'react-select';
import style from './CreateAd.module.css';
import { IconClipboardText, IconGavel, IconLibraryPhoto, IconPhoto } from '@tabler/icons-react';

const CreateAd = () => {
    const stepperRef = useRef(null);
    const dispatch = useDispatch();
    const { t } = useLanguage();
    const { brands } = useSelector((state) => state.content);
    const { countries, governorates } = useSelector((state) => state.auctions);
    
    console.log('Debug:', { countries: countries.data, governorates: governorates.data });
    
    const [formData, setFormData] = useState({
        // first step fields
        brand_id: null,
        model: '',
        manufacture_date: '',
        country_id: null,
        governorate_id: null,
        address: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    // const [isLoading, setIsLoading] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(null);

    const brandOptions = brands.data?.map((b) => ({ value: b.id, label: b.name })) || [];
    const countryOptions = countries.data?.map((c) => ({ value: c.id, label: c.name })) || [];
    const governorateOptions = governorates.data?.map((g) => ({ value: g.id, label: g.name })) || [];

    const validateStep1 = useCallback(() => {
        const newErrors = {};
        if (!formData.brand_id) newErrors.brand_id = t.createAd.required;
        if (!formData.model.trim()) newErrors.model = t.createAd.required;
        if (!formData.manufacture_date.trim()) newErrors.manufacture_date = t.createAd.required;
        if (!formData.country_id) newErrors.country_id = t.createAd.required;
        if (!formData.governorate_id) newErrors.governorate_id = t.createAd.required;
        if (!formData.address.trim()) newErrors.address = t.createAd.required;
        if (!formData.description.trim()) newErrors.description = t.createAd.required;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, t]);

    const handleNext = () => {
        if (validateStep1()) {
            stepperRef.current.next();
        }
    };

    const handlePrevious = () => {
        stepperRef.current.previous();
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        // Clear governorate when country changes
        if (name === 'country_id' && value) {
            setFormData(prev => ({ ...prev, governorate_id: null }));
            setSelectedCountryId(value.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for dispatch - user will provide
        console.log('Form submitted:', formData);
        alert('Form submitted! Dispatch logic to be added.');
    };

    useEffect(() => {
        if (brands.status === 'idle') {
            dispatch(fetchBrands());
        }
        if (countries.status === 'idle') {
            dispatch(fetchCountries());
        }
    }, [brands.status, countries.status, dispatch]);

    // Load governorates when country changes
    useEffect(() => {
        if (formData.country_id && formData.country_id !== selectedCountryId) {
            dispatch(fetchGovernorates(formData.country_id));
            setSelectedCountryId(formData.country_id);
        }
    }, [formData.country_id, selectedCountryId, dispatch]);

    useEffect(() => {
        const stepperEl = document.querySelector('#stepper');
        if (stepperEl && !stepperRef.current) {
            stepperRef.current = new Stepper(stepperEl, {
                linear: false,
                animation: true,
            });

            // Disable ALL step navbar buttons - use only Next/Prev
            const headers = stepperEl.querySelectorAll('.step-trigger');
            headers.forEach(header => {
                header.style.pointerEvents = 'none';
                header.style.cursor = 'default';
                header.classList.add('step-disabled');
            });

            // Ensure step 1 is active initially
            stepperRef.current.to(1);
        }
    }, []);

    return (
        <div className={`${style.create_ad} py-5`}>
            <div className="container">
                <h4 className="fw-medium mb-4">{t.createAd.title}</h4>

                <div id="stepper" className="bs-stepper">
                    {/* Step Headers */}
                    <div className="bs-stepper-header" role="tablist">
                        <div className="step" data-target="#s-1">

                            <button type="button" className="step-trigger" role="tab" aria-controls="s-1">
                                <span className="bs-stepper-circle">1</span>
                                <span className="bs-stepper-label">{t.createAd.step1Title}</span>
                            </button>
                        </div>
                        <div className="line"></div>
                        <div className="step" data-target="#s-2">
                            <button type="button" className="step-trigger" role="tab" aria-controls="s-2">

                                <span className="bs-stepper-circle">2</span>
                                <span className="bs-stepper-label">{t.createAd.step2Title}</span>
                            </button>
                        </div>
                        <div className="line"></div>
                        <div className="step" data-target="#s-3">
                            <button type="button" className="step-trigger" role="tab" aria-controls="s-3">
                                <span className="bs-stepper-circle">3</span>
                                <span className="bs-stepper-label">{t.createAd.step3Title}</span>
                            </button>
                        </div>
                    </div>

                    {/* Step Contents */}
                    <div className="bs-stepper-content mt-4">
                        {/* Step 1 */}
<div id="s-1" className="content" role="tabpanel">

                            <div className="d-flex align-items-center mb-3">
                                <IconClipboardText size={20} stroke={1} className="main-color me-2"/>
                                <b>{t.createAd.step1Title}</b>
                            </div>
                            <p>{t.createAd.step1Desc}</p>
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.brand} *</label>
                                    <Select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={(option) => handleChange('brand_id', option)}
                                        options={brandOptions}
                                        isSearchable={true}
                                        isLoading={brands.status === 'loading'}
                                        placeholder={t.createAd.selectBrand}
                                        className={`basic-select ${errors.brand_id ? 'is-invalid' : ''}`}
                                    />
                                    {errors.brand_id && <div className="invalid-feedback d-block">{errors.brand_id}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.model} *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                                        name="model"
                                        value={formData.model}
                                        onChange={(e) => handleChange('model', e.target.value)}
                                        placeholder={t.createAd.modelPlaceholder}
                                    />
                                    {errors.model && <div className="invalid-feedback d-block">{errors.model}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.manufactureDate} *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.manufacture_date ? 'is-invalid' : ''}`}
                                        name="manufacture_date"
                                        value={formData.manufacture_date}
                                        onChange={(e) => handleChange('manufacture_date', e.target.value)}
                                        placeholder={t.createAd.manufactureDatePlaceholder}
                                    />
                                    {errors.manufacture_date && <div className="invalid-feedback d-block">{errors.manufacture_date}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.country} *</label>
                                    <Select
                                        name="country_id"
                                        value={formData.country_id}
                                        onChange={(option) => handleChange('country_id', option)}
                                        options={countryOptions}
                                        isSearchable={true}
                                        isLoading={countries.status === 'loading'}
                                        placeholder={t.createAd.selectCountry}
                                        className={`basic-select ${errors.country_id ? 'is-invalid' : ''}`}
                                    />
                                    {errors.country_id && <div className="invalid-feedback d-block">{errors.country_id}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.governorate} *</label>
                                    <Select
                                        name="governorate_id"
                                        value={formData.governorate_id}
                                        onChange={(option) => handleChange('governorate_id', option)}
                                        options={governorateOptions}
                                        isSearchable={true}
                                        isLoading={governorates.status === 'loading'}
                                        isDisabled={!formData.country_id}
                                        placeholder={!formData.country_id ? t.createAd.selectCountryFirst : t.createAd.selectGovernorate}
                                        className={`basic-select ${errors.governorate_id ? 'is-invalid' : ''}`}
                                    />
                                    {errors.governorate_id && <div className="invalid-feedback d-block">{errors.governorate_id}</div>}
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.address} *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        name="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder={t.createAd.addressPlaceholder}
                                    />
                                    {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                                </div>
                                <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-3">
                                    <label className="form-label">{t.createAd.description} *</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        rows={4}
                                        placeholder={t.createAd.step1PlaceholderDesc}
                                    />
                                    {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-main-color px-4" onClick={handleNext}>{t.createAd.next}</button>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div id="s-2" className="content" role="tabpanel">
                            <div className="d-flex align-items-center mb-3">
                                <IconLibraryPhoto className="main-color me-2" stroke={1} size={20}/>
                                <b>{t.createAd.step2Title}</b>
                            </div>
                            <p>{t.createAd.step2Desc}</p>
                            <div className="mb-4">
                                <label className="form-label mb-2">{t.createAd.mainImage}</label>
                                <div className={style.car_images}>
                                    <input type="file" accept="image/*" />
                                    <IconPhoto />
                                    <span>{t.createAd.mainImage}</span>
                                </div>
                                <label className="form-label mb-2 mt-4">{t.createAd.otherImages}</label>
                                <div className="row">
                                    {[1,2,3,4].map((i) => (
                                        <div key={i} className="col-md-3 mb-3">
                                            <div className={style.car_images}>
                                                <input type="file" accept="image/*" />
                                                <IconPhoto />
                                                <span>{t.createAd.otherImages}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <label className="form-label mb-2 mt-4">{t.createAd.licenseImages}</label>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className={style.car_images}>
                                            <input type="file" accept="image/*" />
                                            <IconPhoto />
                                            <span>{t.createAd.licenseImages} (Front)</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className={style.car_images}>
                                            <input type="file" accept="image/*" />
                                            <IconPhoto />
                                            <span>{t.createAd.licenseImages} (Back)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-secondary" onClick={handlePrevious}>{t.createAd.previous}</button>
                                <button className="btn btn-main-color" onClick={handleNext}>التالي</button>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div id="s-3" className="content" role="tabpanel">
                            <div className="d-flex align-items-center mb-3">
                                <IconGavel stroke={1} size={20} className="main-color me-2"/>
                                <b>{t.createAd.step3Title}</b>
                            </div>
                            <p>{t.createAd.step3Desc}</p>
                            <div className="row mb-4">
                                <div className="col-md-12 mb-3">
                                    <label className="form-label mb-2">{t.createAd.carReport}</label>
                                    <div className={style.car_images}>
                                        <input type="file" accept=".pdf" />
                                        <span>Upload PDF Report</span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t.createAd.minBid}</label>
                                    <input type="number" className="form-control" placeholder="Example: 5000" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t.createAd.color}</label>
                                    <input type="text" className="form-control" placeholder="Example: Blue" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t.createAd.license}</label>
                                    <input type="text" className="form-control" placeholder="Example: 2029" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">{t.createAd.kilometers}</label>
                                    <input type="number" className="form-control" placeholder="Example: 180" />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-secondary" onClick={handlePrevious}>{t.createAd.previous}</button>
                                <button className="btn btn-success px-4" onClick={handleSubmit}>{t.createAd.confirm}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAd;
