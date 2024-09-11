<script setup lang="ts">
import { computed, reactive, shallowRef, watch } from 'vue';
import type { TreeOption } from 'naive-ui';
import { $t } from '@/locales';
import { fetchAssignPermission, fetchGetApiEndpointTree, fetchGetRoleApiEndpoints } from '@/service/api';

defineOptions({
  name: 'ApiEndpointAuthModal'
});

interface Props {
  /** the roleId */
  roleId: string;
  /** the roleCode */
  roleCode: string;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));

/** api tree data */
const tree = shallowRef<TreeOption[]>([]);

/** tree checks */
const checks = shallowRef<string[]>([]);

/** api auth model */
const model: Api.SystemManage.RolePermission = reactive(createDefaultModel());

function createDefaultModel(): Api.SystemManage.RolePermission {
  return {
    roleId: props.roleId,
    permissions: []
  };
}

/** init api-endpoint tree */
async function getTree() {
  const { error, data } = await fetchGetApiEndpointTree();
  if (!error) {
    tree.value = data.map(recursive);
  }
}

/** init get apiEndpointIds for roleCode, belong checks */
async function getApiEndpointId() {
  checks.value = await fetchGetRoleApiEndpoints(props.roleCode);
  await getTree();
}

/** recursive api-endpoint tree data, add prefix transform treeOption format */
function recursive(item: Api.SystemManage.ApiEndpoint): TreeOption {
  const key =
    item.resource && item.action && item.resource.trim() && item.action.trim()
      ? `${item.resource}:${item.action}`
      : item.id;

  let label = item.summary || item.path || item.controller;
  label += ` (${item.method})`;

  const result: TreeOption = { key, label, id: item.id };
  if (item.children && item.children.length > 0) {
    result.children = item.children.map(recursive);
  }
  return result;
}

/** submit */
async function handleSubmit() {
  model.permissions = findIdsByKeys(checks.value, tree.value);
  const { error } = await fetchAssignPermission(model);
  if (!error) {
    window.$message?.success?.($t('common.modifySuccess'));
    closeModal();
  }
}

function findIdsByKeys(keys: string[], nodes: TreeOption[]): string[] {
  const ids: string[] = [];
  for (const key of keys) {
    // 查找与 key 匹配的节点的 id
    const found = findNodeByKey(key, nodes);
    if (found) {
      ids.push(found.id as string);
    }
  }
  return ids;
}

function findNodeByKey(key: string, nodes: TreeOption[]): TreeOption | undefined {
  for (const node of nodes) {
    if (node.key === key) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const result = findNodeByKey(key, node.children);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
}

function closeModal() {
  visible.value = false;
}

function init() {
  Object.assign(model, createDefaultModel());
  getApiEndpointId();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <NTree
      v-model:checked-keys="checks"
      :data="tree"
      block-line
      expand-on-click
      checkable
      cascade
      virtual-scroll
      class="h-500px"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton quaternary @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
