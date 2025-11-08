import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Employee() {
  const translate = useLanguage();
  const entity = 'employee';

  const searchConfig = {
    displayLabels: ['employeeNumber', 'firstName', 'lastName'],
    searchFields: 'employeeNumber,firstName,lastName,position',
  };

  const deleteModalLabels = ['employeeNumber', 'firstName', 'lastName'];

  const entityDisplayLabels = ['employeeNumber'];

  const Labels = {
    PANEL_TITLE: translate('employee'),
    DATATABLE_TITLE: translate('employee_list'),
    ADD_NEW_ENTITY: translate('add_new_employee'),
    ENTITY_NAME: translate('employee'),
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
