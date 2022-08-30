import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MDBInput, MDBBtn, MDBTextArea, MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Async, { useAsync } from 'react-select/async';
import { Controller, useForm } from 'react-hook-form';
import { createTitle, updateTitle, getTitle, getCurrentTitle } from 'src/app/services/TitleService'
import { createProblem, getCurrentGeneralProblem, getCurrentSpecificProblem, getGeneralProblem, getSpecificProblem, updateProblem } from 'src/app/services/ProblemService';
import { getVariables } from 'src/app/services/VariableService';
import { getCurrentProjectVariables, getProjectVariables } from 'src/app/services/ProjectVariableService';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import Root from '../../Root';
import { Button, FormLabel, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

const initialState = {
    id: "",
    start: "",
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

const ProblemEditor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [title, setTitle] = useState();
    const [variables, setVariables] = useState([]);
    const [projectVariables, setProjectVariables] = useState([]);
    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const problem = watch();

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

    const getProblemOrTitleById = async (projectId, projectVariablesValues) => {
        var querySnapshot = general
            ? await getCurrentGeneralProblem(projectId)
            : await getCurrentSpecificProblem(projectId, order);
        const docs = [];
        querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        if (docs.length > 0) {
            reset(docs[0]);
        } else {
            querySnapshot = await getCurrentTitle(projectId);
            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            if (docs.length > 0) {
                const doc = docs[0];
                setTitle(doc);
                const var1 = projectVariablesValues.find(v => v.value === doc.first_variable);
                const var2 = projectVariablesValues.find(v => v.value === doc.second_variable);
                reset({
                    first_variable: doc.first_variable,
                    second_variable: doc.second_variable,
                    third_variable: "",
                    first_pronoun: var1.pronoun,
                    second_pronoun: var2.pronoun,
                    third_pronoun: "",
                    connector: doc.connector,
                    context_connector: doc.context_connector,
                    dimension: "",
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
        return lookup != null ? lookup.label : "---";
    }

    const saveProblem = async (data, e) => {
        if (!problem.id) {
            await createProblem(problem);
        } else {
            await updateProblem(problem.id, problem);
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
                getProblemOrTitleById(params.id, values2)
            });
        });
    }, [params.id]);

    const optStarts = [
        { value: '¿De qué manera', label: '¿De qué manera' },
        { value: '¿En qué medida', label: '¿En qué medida' },
        { value: '¿Cómo afecta', label: '¿Cómo afecta' },
        { value: '¿De qué manera incide', label: '¿De qué manera incide' },
        { value: '¿En qué medida influye', label: '¿En qué medida influye' },
    ];

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
                    <Typography variant="h3">Problema {general ? "General" : `Específico #${order}`}</Typography>
                </div>
            }
            content={
                <div className="p-24 w-100">
                    <form onSubmit={handleSubmit(saveProblem)}>
                        <div class="card mb-4">
                            <div class="card-body">
                                <div class="shadow-lg p-3 mb-5 bg-body rounded font-medium text-14">
                                    {`${problem.start} ${getVariableLabel(problem.first_variable)} ${problem.connector} ${order == 0 ? problem.context_connector : `${problem.dimension} ${getVariableLabel(problem.second_variable)}`} ${problem.population} - ${problem.location}, ${problem.timestamp}?`}
                                </div>

                                <div class="form-outline mb-4">
                                    <FormLabel>Inicio de Pregunta</FormLabel>
                                    <Controller
                                        control={control}
                                        name="start"
                                        render={({ field: { onChange, onBlur, value, ref } }) => (
                                            <CreatableSelect className="font-medium text-14" options={optStarts} ref={ref} onChange={val => onChange(val.value)} value={optStarts.find(c => c.value === value)} />
                                        )}
                                    />
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

export default ProblemEditor