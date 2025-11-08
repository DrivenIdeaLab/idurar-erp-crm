import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Appointment() {
  const translate = useLanguage();
  const entity = 'appointment';

  const searchConfig = {
    displayLabels: ['customer', 'vehicle', 'appointmentDate'],
    searchFields: 'customer,vehicle',
  };

  const deleteModalLabels = ['appointmentDate', 'appointmentTime'];

  const entityDisplayLabels = ['appointmentDate', 'appointmentTime'];

  const Labels = {
    PANEL_TITLE: translate('appointment'),
    DATATABLE_TITLE: translate('appointment_list'),
    ADD_NEW_ENTITY: translate('add_new_appointment'),
    ENTITY_NAME: translate('appointment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    entityDisplayLabels,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}
