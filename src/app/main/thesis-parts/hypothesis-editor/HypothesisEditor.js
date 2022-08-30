import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MDBInput, MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Async, { useAsync } from 'react-select/async';
import { getVariables } from 'src/app/services/VariableService';
import { Controller, useForm } from 'react-hook-form';
import { getCurrentProjectVariables, getProjectVariables } from 'src/app/services/ProjectVariableService';
import { createHypothesis, getCurrentGeneralHypothesis, getCurrentSpecificHypothesis, getGeneralHypothesis, getSpecificHypothesis, updateHypothesis } from 'src/app/services/HypothesisService';
import { getCurrentGeneralProblem, getCurrentSpecificProblem, getGeneralProblem, getSpecificProblem } from 'src/app/services/ProblemService';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import Root from '../../Root';
import { Button, FormLabel, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

const initialState = {
    id: "",
    connector: "",
    context_connector: "",
    first_pronoun: "",
    second_pronoun: "",
    third_pronoun: "",
    first_variable: "",
    second_variable: "",
    third_variable: "",
    dimension: "",
    order: 0,
    project_id: "",
    project_version: "",
    is_general: false
};

const HypothesisEditor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [title, setTitle] = useState();
    const [problem, setProblem] = useState();
    const [variables, setVariables] = useState([]);
    const [projectVariables, setProjectVariables] = useState([]);
    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const hypothesis = watch();

    const [searchParams] = useSearchParams();
    const general = searchParams.get("general") == "true";
    const order = general ? 0 : parseInt(searchParams.get("orden"));

    const getAllVariables = async () => {
        const querySnapshot = await getVariables();
        const docs = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            docs.push({ label: data.value, value: doc.id });
        })
        setVariables(docs);
        return docs;
    };

    const getAllProjectVariables = async (projectId, variableValues) => {
        const querySnapshot = await getCurrentProjectVariables(projectId);
        const docs = [];
        querySnapshot.forEach((doc) => {
            const variable = variableValues.find(v => v.value == doc.data().variable);
            console.log(doc.data());
            docs.push({ label: `${doc.data().pronoun} ${variable.label}`, value: variable.value, pronoun: doc.data().pronoun });
        });
        setProjectVariables(docs);
        return docs;
    }

    const getHypothesisOrProblemById = async (projectId, projectVariablesValues) => {
        var querySnapshot = general
            ? await getCurrentGeneralHypothesis(projectId)
            : await getCurrentSpecificHypothesis(projectId, order);
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        if (docs.length > 0) {
            reset(docs[0]);
        } else {
            querySnapshot = general
                ? await getCurrentGeneralProblem(projectId)
                : await getCurrentSpecificProblem(projectId, order);
            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            if (docs.length > 0) {
                const doc = docs[0];
                setTitle(doc);
                reset({
                    first_variable: doc.first_variable,
                    second_variable: doc.second_variable,
                    third_variable: general ? "" : doc.third_variable,
                    connector: doc.connector,
                    context_connector: doc.context_connector,
                    dimension: general ? "" : doc.dimension,
                    population: doc.population,
                    location: doc.location,
                    timestamp: doc.timestamp,
                    is_general: general,
                    order: order,
                    project_id: params.id,
                    project_version_id: ""
                });
            }
        }

    }

    const getVariableLabel = (variableId) => {
        const lookup = projectVariables.find(x => x.value === variableId);
        var resultStr = "---";
        if (lookup) {
            resultStr = lookup.label.charAt(0).toUpperCase() + lookup.label.slice(1);
        }
        return resultStr;
    }

    const saveHypothesis = async (data, e) => {
        if (!hypothesis.id) {
            await createHypothesis(hypothesis);
        } else {
            await updateHypothesis(hypothesis.id, hypothesis);
        }
        dispatch(
            showMessage({
                message: 'Cambios guardados',
                variant: 'success'
            })
        );
        reset(initialState);
        navigate(`/proyectos/${params.id}/detalle`);
    };

    useEffect(() => {
        getAllVariables().then((values) => {
            getAllProjectVariables(params.id, values).then((values2) => {
                getHypothesisOrProblemById(params.id, values2)
            });
        });
    }, [params.id]);

    const optPronouns = [
        { value: 'la', label: 'la' },
        { value: 'el', label: 'el' },
        { value: 'las', label: 'las' },
        { value: 'los', label: 'los' }
    ];

    const optConnectors = [
        { label: 'y', value: 'y' },
        { label: 'para', value: 'para' },
        { label: 'contribución', value: 'contribución' },
        { label: 'impacto', value: 'impacto' },
        { label: 'efecto', value: 'efecto' },
        { label: 'influye', value: 'influye' },
        { label: 'en la', value: 'en la' },
        { label: 'durante', value: 'durante' },
        { label: 'relación', value: 'relación' },
        { label: 'se relaciona con', value: 'se relaciona con' },
        { label: 'con', value: 'con' },
        { label: 'en', value: 'en' },
        { label: 'del', value: 'del' },
    ];

    return (
        <Root
            header={
                <div className="p-24">
                    <Typography variant="h3">Hipótesis {general ? "General" : `Específico #${order}`}</Typography>
                </div>
            }
            content={
                <div className="p-24 w-100">
                    <form onSubmit={handleSubmit(saveHypothesis)} className="w-100">
                        <div class="card mb-4">

                            <div class="card-body">
                                <div class="shadow-lg p-3 mb-5 bg-body rounded font-medium text-14">
                                    {`${getVariableLabel(hypothesis.first_variable)} ${hypothesis.connector} ${order == 0 ? hypothesis.context_connector : `${hypothesis.dimension} ${getVariableLabel(hypothesis.second_variable)}`} ${hypothesis.population} - ${hypothesis.location}, ${hypothesis.timestamp}`}
                                </div>

                                <div class="form-outline mb-4">
                                    <FormLabel>Primera Variable</FormLabel>
                                    <Controller
                                        control={control}
                                        name="first_variable"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <Select className="font-medium text-14" options={projectVariables} ref={ref} onChange={val => onChange(val.value)} value={projectVariables.find(c => c.value === value)} />
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <FormLabel>Conector</FormLabel>
                                    <Controller
                                        control={control}
                                        name="connector"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <CreatableSelect className="font-medium text-14" options={optConnectors} ref={ref} onChange={val => onChange(val.value)} value={optConnectors.find(c => c.value === value)} />
                                        )}
                                    />
                                </div>

                                {general ?
                                    <div class="form-outline mb-4">
                                        <FormLabel>Conector</FormLabel>
                                        <Controller
                                            control={control}
                                            name="context_connector"
                                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                                <CreatableSelect className="font-medium text-14" options={optConnectors} ref={ref} onChange={val => onChange(val.value)} value={optConnectors.find(c => c.value === value)} />
                                            )}
                                        />
                                    </div>
                                    :
                                    <>
                                        <div class="form-outline mb-4">
                                            <Controller
                                                control={control}
                                                name="dimension"
                                                render={({ field }) => (
                                                    <TextField {...field} label="Dimensión" variant="outlined" fullWidth />
                                                )}
                                            />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <FormLabel>Segunda Variable</FormLabel>
                                            <Controller
                                                control={control}
                                                name="second_variable"
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <Select className="font-medium text-14" options={projectVariables} ref={ref} onChange={val => onChange(val.value)} value={projectVariables.find(c => c.value === value)} />
                                                )}
                                            />
                                        </div>
                                        <div class="form-outline mb-4">
                                            <FormLabel>Conector</FormLabel>
                                            <Controller
                                                control={control}
                                                name="context_connector"
                                                render={({ field: { onChange, onBlur, value, ref } }) => (
                                                    <CreatableSelect className="font-medium text-14" options={optConnectors} ref={ref} onChange={val => onChange(val.value)} value={optConnectors.find(c => c.value === value)} />
                                                )}
                                            />
                                        </div>
                                    </>
                                }

                                <div class="form-outline mb-4">
                                    <Controller
                                        control={control}
                                        name="population"
                                        render={({ field }) => (
                                            <TextField {...field} label="Población" variant="outlined" fullWidth />
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <Controller
                                        control={control}
                                        name="location"
                                        render={({ field }) => (
                                            <TextField {...field} label="Ubicación" variant="outlined" fullWidth />
                                        )}
                                    />
                                </div>

                                <div class="form-outline mb-4">
                                    <Controller
                                        control={control}
                                        name="timestamp"
                                        render={({ field }) => (
                                            <TextField {...field} label="Tiempo" variant="outlined" fullWidth />
                                        )}
                                    />
                                </div>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <Button variant="contained" onClick={() => navigate(`/proyectos/${params.id}/detalle`)}>
                                    <ArrowBackIcon />&emsp;Regresar
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    <SaveIcon />&emsp;Guardar
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        />
    )
}

export default HypothesisEditor