import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function TimeEntry() {
  const translate = useLanguage();
  const entity = 'timeentry';

  const searchConfig = {
    displayLabels: ['employee.employeeNumber', 'entryType'],
    searchFields: 'employee.employeeNumber,employee.firstName,employee.lastName',
  };

  const deleteModalLabels = ['entryType', 'timestamp'];

  const entityDisplayLabels = ['entryType'];

  const Labels = {
    PANEL_TITLE: translate('time_entry'),
    DATATABLE_TITLE: translate('time_entry_list'),
    ADD_NEW_ENTITY: translate('add_new_time_entry'),
    ENTITY_NAME: translate('time_entry'),
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
      updateForm={<DynamicForm fields={fields} isUpdateForm={true} />}
      config={config}
    />
  );
}
