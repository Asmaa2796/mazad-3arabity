import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../../../shared/i18n/LanguageProvider';
import { fetchBrands } from '../../../Redux/Slices/contentSlice';
import { fetchCountries, postAuction } from '../../../Redux/Slices/auctionsSlice';
import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import Select from 'react-select';
import { AsyncPaginate } from "react-select-async-paginate";
import style from './CreateAd.module.css';
import {
    IconClipboardText,
    IconFile,
    IconGavel,
    IconLibraryPhoto,
    IconPhoto,
    IconX,
    IconEdit
} from '@tabler/icons-react';
import axios from 'axios';
import { BASE_URL } from './../../../shared/utils.js/utils';
import { Toaster } from 'react-hot-toast';
import { toast as toastify } from "react-toastify";
import { toast as hot } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const CreateAd = () => {
    const stepperRef = useRef(null);
    const dispatch = useDispatch();
    const { t, language } = useLanguage();
    const { brands } = useSelector((state) => state.content);
    const { countries, postAuction : postAuctionState } = useSelector((state) => state.auctions);
    const [govAdditional, setGovAdditional] = useState({ page: 1 });
    const [hasGovernorates, setHasGovernorates] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // first step fields
        brand_id: null,
        model: '', 
        manufacture_date: '',
        country_id: null,
        governorate_id: null,
        address: '',
        description: '',
        // second step
        main_image: null,
        gallery: [null, null, null, null],
        report: null,
        // step 3
        selling_price: '',
        color: '',
        kilos: '',
        licence: ''
    });
    const [errors, setErrors] = useState({});

    // check if country has govs to render its jsx
    const checkHasGovernorates = useCallback(async (countryId) => {
        if (!countryId) {
            setHasGovernorates(false);
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/governorates/${countryId}?page=1&per_page=1`, {
                headers: { "accept-language": language }
            });
            setHasGovernorates(response.data.pagination?.total > 0 || response.data.data.length > 0);
        } catch (error) {
            setHasGovernorates(false);
        }
    }, [language]);

    const loadGovernorates = async (search, loadedOptions, { page }) => {
        if (!formData.country_id || !hasGovernorates) {
            return { options: [], hasMore: false };
        }

        const response = await axios.get(
            `${BASE_URL}/governorates/${formData.country_id.value}`,
            {
                params: { page: page || 1, search },
                headers: { "accept-language": language }
            }
        );

        return {
            options: response.data.data.map(g => ({ value: g.id, label: g.name })),
            hasMore: page < response.data.pagination.last_page,
            additional: { page: (page || 1) + 1 }
        };
    };

    const handleFileChange = (name, index, file) => {
        setFormData(prev => {
            const updated = { ...prev };
            if (name === 'gallery' && index !== undefined) {
                const newGallery = [...updated.gallery];
                newGallery[index] = file;
                updated.gallery = newGallery;
            } else {
                updated[name] = file;
            }
            return updated;
        });
    };

    const handleRemoveFile = (name, index = null) => {
        setFormData(prev => {
            const updated = { ...prev };
            if (name === 'gallery' && index !== undefined) {
                const newGallery = [...updated.gallery];
                newGallery[index] = null;
                updated.gallery = newGallery;
            } else {
                updated[name] = null;
            }
            return updated;
        });
        hot.success(t.createAd.removeFile);
    };

    const brandOptions = brands.data?.map((b) => ({ value: b.id, label: b.name })) || [];

    const validateStep1 = useCallback(() => {
        const newErrors = {};

        if (!formData.brand_id) newErrors.brand_id = t.createAd.required;
        if (!formData.model.trim()) newErrors.model = t.createAd.required;
        if (!formData.manufacture_date.trim()) newErrors.manufacture_date = t.createAd.required;
        if (!formData.country_id) newErrors.country_id = t.createAd.required;

        if (formData.country_id && hasGovernorates) {
            if (!formData.governorate_id || !formData.governorate_id.value) {
                newErrors.governorate_id = t.createAd.required;
            }
        }

        if (!formData.address.trim()) newErrors.address = t.createAd.required;
        if (!formData.description.trim()) newErrors.description = t.createAd.required;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, t, hasGovernorates]);

    const validateStep2 = useCallback(() => {
        const newErrors = {};
        if (!formData.main_image) {
            newErrors.main_image = t.createAd.required;
        }
        const galleryFiles = formData.gallery.filter(f => f !== null);
        if (galleryFiles.length === 0) {
            newErrors.gallery = `${t.createAd.required} - (${t.createAd.at_least_one_item})`;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.main_image, formData.gallery, t]);

    const validateStep3 = useCallback(() => {
        const newErrors = {};
        if (!formData.selling_price || formData.selling_price <= 0) {
            newErrors.selling_price = t.createAd.required;
        }
        if (!formData.color.trim()) {
            newErrors.color = t.createAd.required;
        }
        if (!formData.licence) {
            newErrors.licence = t.createAd.required;
        }
        if (!formData.kilos || formData.kilos <= 0) {
            newErrors.kilos = t.createAd.required;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, t]);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    const handleNext = (step = 1) => {
        let isValid = false;
        if (step === 1) isValid = validateStep1();
        else if (step === 2) isValid = validateStep2();
        else if (step === 3) isValid = validateStep3();

        if (isValid) {
            stepperRef.current.next();
            scrollTop();
        }
    };

    const handlePrevious = () => {
        stepperRef.current.previous();
        scrollTop();
    };

    const handleChange = (name, value) => {
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'country_id') {
                updated.governorate_id = null;
                setHasGovernorates(false);
                setGovAdditional({ page: 1 });
                checkHasGovernorates(value?.value);
            }

            return updated;
        });

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        dispatch(postAuction(formData));
    };
    // Helper to get display values
    const getDisplayValue = (field) => {
        if (field === null || field === '' || field === undefined) return '—';
        if (typeof field === 'object') {
            return field?.label || '—';
        }
        return field;
    };

    const years = Array.from(
        { length: new Date().getFullYear() - 1950 + 1 },
        (_, i) => 1950 + i
    ).reverse();

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            country_id: null,
            governorate_id: null,
        }));
        setGovAdditional({ page: 1 });
        dispatch(fetchCountries(language));
        dispatch(fetchBrands({ lang: language }));
    }, [language, dispatch]);

    useEffect(() => {
        if (brands.status === 'idle') {
            dispatch(fetchBrands({ lang: language }));
        }
        if (countries.status === 'idle') {
            dispatch(fetchCountries());
        }
        if (postAuctionState.status === "succeeded") {
            toastify.success(t.createAd.submitted, {
                onClose: () => {
                    window.location.href = "/all-auctions";
                }
            });
        }

        if (postAuctionState.status === "failed") {
            toastify.error(postAuctionState.error || "Something went wrong");
        }

    }, [brands.status, countries.status, postAuctionState.status, navigate, dispatch, language]);

    useEffect(() => {
        const stepperEl = document.querySelector('#stepper');
        if (stepperEl && !stepperRef.current) {
            stepperRef.current = new Stepper(stepperEl, {
                linear: false,
                animation: true,
            });

            const headers = stepperEl.querySelectorAll('.step-trigger');
            headers.forEach(header => {
                header.style.pointerEvents = 'none';
                header.style.cursor = 'default';
                header.classList.add('step-disabled');
            });

            stepperRef.current.to(1);
        }
    }, []);

    return (
        <>

            <div className={`${style.create_ad} py-5`}>
                <div className="container">
                    <h4 className="fw-medium mb-4">{t.createAd.title}</h4>

                    <div id="stepper" className="bs-stepper">
                        {/* Headers */}
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
                            <div className="line"></div>
                            <div className="step" data-target="#s-4">
                                <button type="button" className="step-trigger" role="tab" aria-controls="s-4">
                                    <span className="bs-stepper-circle">4</span>
                                    <span className="bs-stepper-label">{t.createAd.step4Title}</span>
                                </button>
                            </div>
                        </div>

                        {/* Contents */}
                        <div className="bs-stepper-content mt-4">
                            {/* Step 1: Basic Info */}
                            <div id="s-1" className="content" role="tabpanel">
                                <div className="d-flex align-items-center mb-3">
                                    <IconClipboardText size={20} stroke={1} className="main-color me-2" />
                                    <b>{t.createAd.step1Title}</b>
                                </div>
                                <p>{t.createAd.step1Desc}</p>
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                        <label className="form-label">{t.createAd.brand} *</label>
                                        <Select
                                            key={language}
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
                                        <select
                                            className={`form-control ${errors.manufacture_date ? 'is-invalid' : ''}`}
                                            name="manufacture_date"
                                            value={formData.manufacture_date}
                                            onChange={(e) => handleChange('manufacture_date', e.target.value)}
                                        >
                                            <option value="" disabled>{t.createAd.manufactureDatePlaceholder}</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        {errors.manufacture_date && (
                                            <div className="invalid-feedback d-block">{errors.manufacture_date}</div>
                                        )}
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                        <label className="form-label">{t.createAd.country} *</label>
                                        <Select
                                            key={language}
                                            value={formData.country_id}
                                            onChange={(option) => handleChange('country_id', option)}
                                            options={countries.data?.map(c => ({
                                                value: c.id,
                                                label: c.name
                                            })) || []}
                                            placeholder={t.createAd.selectCountry}
                                            className={errors.country_id ? 'is-invalid' : ''}
                                        />
                                        {errors.country_id && (
                                            <div className="invalid-feedback d-block">{errors.country_id}</div>
                                        )}
                                    </div>
                                    {formData.country_id && hasGovernorates && (
                                        <div className="col-xl-6 col-lg-6 col-md-12 col-12 mb-3">
                                            <label className="form-label">{t.createAd.governorate} *</label>
                                            <AsyncPaginate
                                                key={`${formData.country_id?.value || 'none'}-${language}`}
                                                value={formData.governorate_id}
                                                loadOptions={loadGovernorates}
                                                onChange={(option) => handleChange('governorate_id', option)}
                                                additional={govAdditional}
                                                isDisabled={!formData.country_id}
                                                className='w-100'
                                                placeholder={
                                                    !formData.country_id
                                                        ? t.createAd.selectCountryFirst
                                                        : t.createAd.selectGovernorate
                                                }
                                            />
                                            {errors.governorate_id && (
                                                <div className="invalid-feedback d-block">{errors.governorate_id}</div>
                                            )}
                                        </div>
                                    )}
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
                                        <button className="btn btn-main-color px-4" onClick={() => handleNext(1)}>{t.createAd.next}</button>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Photos */}
                            <div id="s-2" className="content" role="tabpanel">
                                <div className="d-flex align-items-center mb-3">
                                    <IconLibraryPhoto className="main-color me-2" stroke={1} size={20} />
                                    <b>{t.createAd.step2Title}</b>
                                </div>
                                <p>{t.createAd.step2Desc}</p>
                                <div className="mb-4">
                                    <label className="form-label mb-2">{t.createAd.mainImage} *</label>
                                    <div className={`${style.car_images} ${formData.main_image ? style.has_image : ''}`}>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file && !file.type.match('image/(jpeg|png)')) {
                                                    toastify.warning('Only JPG and PNG allowed for main image');
                                                    e.target.value = '';
                                                    return;
                                                }
                                                handleFileChange('main_image', null, file);
                                            }}
                                        />
                                        {formData.main_image ? (
                                            <>
                                                <img src={URL.createObjectURL(formData.main_image)} alt="Main" />
                                                <button
                                                    className={style['remove_btn']}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFile('main_image');
                                                    }}
                                                >
                                                    <IconX className='text-white' size={16} stroke={1.5} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <IconPhoto />
                                                <span>{t.createAd.mainImage}</span>
                                            </>
                                        )}
                                    </div>
                                    {errors.main_image && <div className="invalid-feedback d-block">{errors.main_image}</div>}

                                    <label className="form-label mb-2 mt-4">{t.createAd.otherImages} *</label>
                                    <div className="row">
                                        {formData.gallery.map((file, index) => (
                                            <div key={index} className="col-md-3 mb-3">
                                                <div className={`${style.car_images} ${file ? style.has_image : ''}`}>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png"
                                                        onChange={(e) => {
                                                            const newFile = e.target.files[0];
                                                            if (newFile && !newFile.type.match('image/(jpeg|png)')) {
                                                                toastify.warning('Only JPG and PNG allowed for gallery images');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            handleFileChange('gallery', index, newFile);
                                                        }}
                                                    />
                                                    {file ? (
                                                        <>
                                                            <img src={URL.createObjectURL(file)} alt={`Gallery ${index + 1}`} />
                                                            <button
                                                                className={style['remove_btn']}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveFile('gallery', index);
                                                                }}
                                                            >
                                                                <IconX className='text-white' size={16} stroke={1.5} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <IconPhoto />
                                                            <span>{t.createAd.otherImages}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.gallery && <div className="invalid-feedback d-block">{errors.gallery}</div>}

                                    <label className="form-label mb-2 mt-4">{t.createAd.carReport}</label>
                                    <div className={`${style.car_images} ${formData.report ? style.has_image : ''}`}>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file && file.type !== 'application/pdf') {
                                                    toastify.warning(t.createAd.only_pdf_allowed_for_report);
                                                    e.target.value = '';
                                                    return;
                                                }
                                                handleFileChange('report', null, file);
                                            }}
                                        />
                                        {formData.report ? (
                                            <>
                                                <img src="/pdf.png" alt={t.createAd.pdf_uploaded} />
                                                <span>{t.createAd.pdf_uploaded}</span>
                                                <button
                                                    className={style['remove_btn']}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFile('report');
                                                    }}
                                                >
                                                    <IconX className='text-white' size={16} stroke={1.5} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <IconFile size={40} />
                                                <span>{t.createAd.upload_file}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-secondary" onClick={handlePrevious}>{t.createAd.previous}</button>
                                    <button className="btn btn-main-color" onClick={() => handleNext(2)}>{t.createAd.next}</button>
                                </div>
                            </div>

                            {/* Step 3: Auction Data */}
                            <div id="s-3" className="content" role="tabpanel">
                                <div className="d-flex align-items-center mb-3">
                                    <IconGavel stroke={1} size={20} className="main-color me-2" />
                                    <b>{t.createAd.step3Title}</b>
                                </div>
                                <p>{t.createAd.step3Desc}</p>
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t.createAd.selling_price} *</label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            className={`form-control ${errors.selling_price ? 'is-invalid' : ''}`}
                                            value={formData.selling_price}
                                            onChange={(e) =>
                                                handleChange(
                                                    'selling_price',
                                                    e.target.value.replace(/\D/g, "")
                                                )
                                            }
                                            onKeyDown={(e) => {
    if (e.key === "." || e.key === "e" || e.key === "-") {
      e.preventDefault();
    }
  }}
                                            placeholder={t.createAd.selling_pricePlaceholder}
                                            min="0"
                                        />
                                        {errors.selling_price && <div className="invalid-feedback d-block">{errors.selling_price}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t.createAd.color} *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.color ? 'is-invalid' : ''}`}
                                            value={formData.color}
                                            onChange={(e) => handleChange('color', e.target.value)}
                                            placeholder={t.createAd.colorPlaceholder}
                                        />
                                        {errors.color && <div className="invalid-feedback d-block">{errors.color}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t.createAd.licence} *</label>
                                        <select
                                            className={`form-control ${errors.licence ? 'is-invalid' : ''}`}
                                            value={formData.licence}
                                            onChange={(e) => handleChange('licence', e.target.value)}
                                        >
                                            <option value="">{t.createAd.licencePlaceholder}</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        {errors.licence && <div className="invalid-feedback d-block">{errors.licence}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t.createAd.kilos} *</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.kilos ? 'is-invalid' : ''}`}
                                            value={formData.kilos}
                                            onChange={(e) => handleChange('kilos', e.target.value)}
                                            placeholder={t.createAd.kilosPlaceholder}
                                            min="0"
                                        />
                                        {errors.kilos && <div className="invalid-feedback d-block">{errors.kilos}</div>}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-secondary" onClick={handlePrevious}>{t.createAd.previous}</button>
                                    <button className="btn btn-main-color px-4" onClick={() => handleNext(3)}>{t.createAd.next}</button>
                                </div>
                            </div>

                            {/* Step 4: Review */}
                            <div id="s-4" className="content" role="tabpanel">
                                <div className='bg-white shadow-sm rounded-4 p-3 border my-2'>
                                    <div className="d-flex align-items-center mb-3">
                                        <IconEdit size={20} stroke={1} className="main-color me-2" />
                                        <b>{t.createAd.step4Title}</b>
                                    </div>
                                    <p>{t.createAd.step4Desc}</p>

                                    <div className="row">
                                        {/* Step 1 Summary */}
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-4">
                                            <h6 className="text-main-color mb-3 border-bottom pb-2">{t.createAd.step1Title}</h6>
                                            <div className="row">
                                                <div className="col-md-3 mb-2">
                                                    <strong>{t.createAd.brand}:</strong> {getDisplayValue(formData.brand_id)}
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <strong>{t.createAd.model}:</strong> {getDisplayValue(formData.model)}
                                                </div>
                                                <div className="col-md-2 mb-2">
                                                    <strong>{t.createAd.manufactureDate}:</strong> {getDisplayValue(formData.manufacture_date)}
                                                </div>
                                                <div className="col-md-2 mb-2">
                                                    <strong>{t.createAd.country}:</strong> {getDisplayValue(formData.country_id)}
                                                </div>
                                                {formData.governorate_id && (
                                                    <div className="col-md-2 mb-2">
                                                        <strong>{t.createAd.governorate}:</strong> {getDisplayValue(formData.governorate_id)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-2">
                                                    <strong>{t.createAd.address}:</strong> {getDisplayValue(formData.address)}
                                                </div>
                                            </div>
                                            <div className="mb-0">
                                                <strong>{t.createAd.description}:</strong>
                                                <p className="mt-1 mb-0">{getDisplayValue(formData.description)}</p>
                                            </div>
                                        </div>

                                        {/* Step 3 Summary */}
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-4">
                                            <h6 className="text-main-color mb-3 border-bottom pb-2">{t.createAd.step3Title}</h6>
                                            <div className="row">
                                                <div className="col-md-3 mb-2">
                                                    <strong>{t.createAd.selling_price}:</strong> {getDisplayValue(formData.selling_price)} {t.auctions.pounds}
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <strong>{t.createAd.color}:</strong> {getDisplayValue(formData.color)}
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <strong>{t.createAd.licence}:</strong> {getDisplayValue(formData.licence)}
                                                </div>
                                                <div className="col-md-3 mb-2">
                                                    <strong>{t.createAd.kilos}:</strong> {getDisplayValue(formData.kilos)} {t.auctions.km}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Images Preview */}
                                        {(formData.main_image || formData.gallery.some(f => f) || formData.report) && (
                                            <>
                                                <div className='col-xl-12 col-lg-12 col-md-12 col-12 mb-4'>
                                                    <h6 className="text-main-color mb-3 border-bottom pb-2">
                                                        {t.createAd.step2Title}
                                                    </h6>
                                                </div>
                                                <div className="row">
                                                    {formData.main_image && (
                                                        <div className="col-xl-4 col-lg-4 col-md-12 col-12 mb-3">
                                                            <strong>{t.createAd.mainImage}:</strong>
                                                            <div className={style.car_images + ' ' + style.has_image}>
                                                                <img src={URL.createObjectURL(formData.main_image)} alt="Main" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className='col-xl-12 col-lg-12 col-md-12 col-12 mb-3'>
                                                        <div className='row'>
                                                            <strong>{t.createAd.otherImages}:</strong>
                                                            {formData.gallery.filter(f => f).map((file, index) => (
                                                                <div key={'g' + index} className="col-xl-2 col-md-2 col-md-4 col-12 mb-3">
                                                                    <div className={style.car_images + ' ' + style.has_image}>
                                                                        <img src={URL.createObjectURL(file)} alt={`Gallery ${index + 1}`} />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {formData.report && (
                                                        <div className="col-xl-3 col-lg-3 col-md-12 col-12 mb-3">
                                                            <strong>{t.createAd.carReport}:</strong>
                                                            <div className={style.car_images + ' ' + style.has_image}>
                                                                <img src="/pdf.png" alt={t.createAd.pdf_uploaded} />
                                                                <span>{t.createAd.pdf_uploaded}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-secondary" onClick={handlePrevious}>{t.createAd.previous}</button>
                                    <button
                                        className="btn btn-success px-4"
                                        onClick={handleSubmit}
                                        disabled={postAuctionState.status === "loading"}
                                    >
                                        {postAuctionState.status === "loading"
                                            ? t.common.loading
                                            : t.createAd.confirm}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position='top-center' />
        </>
    );
};

export default CreateAd;