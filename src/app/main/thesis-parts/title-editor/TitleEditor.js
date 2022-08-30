import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MDBInput, MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import Select, { InputActionMeta } from 'react-select';
import Async, { useAsync } from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import { useForm, useFormState, watch, Controller } from 'react-hook-form';
import { createTitle, updateTitle, getTitle, getCurrentTitle } from 'src/app/services/TitleService'
import { getVariables, getVariablesByCareerId } from 'src/app/services/VariableService';
import { getCurrentProjectVariables, getProjectVariables } from 'src/app/services/ProjectVariableService';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import Root from '../../Root';
import { Button, FormLabel, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';

const initialState = {
    first_variable: "",
    second_variable: "",
    connector: "",
    context_connector: "",
    population: "",
    location: "",
    timestamp: "",
    project_id: "",
    project_version_id: "",
};

const TitleEditor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [variables, setVariables] = useState([]);
    const [projectVariables, setProjectVariables] = useState([]);
    const { control, reset, handleSubmit, watch } = useForm({
        defaultValues: initialState
    });
    const title = watch();

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
            docs.push({ label: variable.label, value: variable.value });
        });
        setProjectVariables(docs);
    }

    const getTitleById = async (projectId) => {
        try {
            const querySnapshot = await getCurrentTitle(projectId);
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            if (docs.length > 0) {
                const doc = docs[0];
                reset(doc);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getVariableLabel = (variableId) => {
        const lookup = variables.find(x => x.value === variableId);
        return lookup != null ? lookup.label : "---";
    }

    useEffect(() => {
        const subscription = watch((data) => {
            console.log(data);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [watch]);

    const onSubmit = async (data, e) => {
        if (!title.id) {
            await createTitle({ ...title, project_id: params.id, project_version_id: "" });
        } else {
            await updateTitle(title.id, title);
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

    const onError = (errors, e) => {
        console.log(errors, e);
    };

    useEffect(() => {
        getAllVariables().then((values) => {
            getAllProjectVariables(params.id, values);
        });
        getTitleById(params.id);
    }, [reset]);

    const optVariables = [
        { label: 'Gestión por procesos', value: 'Gestión por procesos' },
        { label: 'Proceso administrativo', value: 'Proceso administrativo' },
        { label: 'Toma de decisiones', value: 'Toma de decisiones' },
        { label: 'Productividad', value: 'Productividad' },
        { label: 'Planificación estratégica', value: 'Planificación estratégica' },
        { label: 'Clima Organizacional', value: 'Clima Organizacional' },
        { label: 'Eficiencia', value: 'Eficiencia' },
        { label: 'Calidad de vida', value: 'Calidad de vida' },
        { label: 'Gestión administrativa', value: 'Gestión administrativa' },
        { label: 'Eficacia', value: 'Eficacia' },
        { label: 'Competividad', value: 'Competividad' },
        { label: 'Estrategias ', value: 'Estrategias' },
        { label: 'Planificación', value: 'Planificación' },
        { label: 'Gestión pública', value: 'Gestión pública' },
        { label: 'Capacitación', value: 'Capacitación' },
        { label: 'Clima laboral', value: 'Clima laboral' },
        { label: 'Gestión empresarial', value: 'Gestión empresarial' },
        { label: 'Organización', value: 'Organización' },
        { label: 'Sistema de contrataciones', value: 'Sistema de contrataciones' },
    ];

    const optVariables2 = [
        { label: 'Aprendizaje cooperativo' },
        { label: 'Desempeño académico' },
        { label: 'Habilidades blandas' },
        { label: 'Aprendizaje' },
        { label: 'Rendimiento académico' },
        { label: 'Conocimiento' },
        { label: 'Inteligencia emocional' },
        { label: 'Desempeño docente' },
        { label: 'Habilidades sociales' },
        { label: 'Gestión educativa' },
        { label: 'Comprensión lectora' },
        { label: 'Gestión curricular' },
        { label: 'Estrategias de aprendizaje' },
        { label: 'Calidad educativa' },
        { label: 'Acompañamiento docente' },
        { label: 'Estilos de enseñanza' },
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
        { label: 'con', value: 'con' },
        { label: 'en', value: 'en' },
        { label: 'del', value: 'del' },
    ];

    return (
        <Root
            header={
                <div className="p-24">
                    <Typography variant="h3">Título</Typography>
                </div>
            }
            content={
                <div className="p-24 w-100">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="card">
                            <div class="card-body">
                                <div class="shadow-lg p-3 mb-5 bg-body rounded font-medium text-14">
                                    {`${getVariableLabel(title.first_variable)} ${title.connector} ${getVariableLabel(title.second_variable)} ${title.context_connector} ${title.population} - ${title.location} ${title.timestamp}`}
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
                                <Button type="submit" variant="contained" color="primary" disabled={!title.first_variable || !title.second_variable}>
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

export default TitleEditor