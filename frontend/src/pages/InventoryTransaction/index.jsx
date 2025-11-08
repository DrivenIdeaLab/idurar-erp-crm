import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function InventoryTransaction() {
  const translate = useLanguage();
  const entity = 'inventorytransaction';

  const searchConfig = {
    displayLabels: ['part.partNumber', 'type'],
    searchFields: 'part.partNumber,part.name,type',
  };

  const deleteModalLabels = ['part.partNumber', 'type', 'quantityChange'];

  const entityDisplayLabels = ['type'];

  const Labels = {
    PANEL_TITLE: translate('inventory_transaction'),
    DATATABLE_TITLE: translate('inventory_transaction_list'),
    ADD_NEW_ENTITY: translate('add_new_transaction'),
    ENTITY_NAME: translate('inventory_transaction'),
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
