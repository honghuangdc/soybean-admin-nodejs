<script setup lang="tsx">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { fetchGetOperationLogList } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import OperationSearch from './modules/operation-log-search.vue';

dayjs.extend(utc);

const appStore = useAppStore();

const { columns, data, getData, getDataByPage, loading, mobilePagination, searchParams, resetSearchParams } = useTable({
  apiFn: fetchGetOperationLogList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 20,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    username: null,
    domain: null,
    moduleName: null,
    method: null
  },
  columns: () => [
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'userId',
      title: 'userId',
      align: 'center',
      width: 80
    },
    {
      key: 'username',
      title: 'username',
      align: 'center',
      width: 100
    },
    {
      key: 'domain',
      title: 'domain',
      align: 'center',
      width: 80
    },
    {
      key: 'moduleName',
      title: 'moduleName',
      align: 'center',
      width: 120
    },
    {
      key: 'description',
      title: 'description',
      align: 'center',
      minWidth: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'requestId',
      title: 'requestId',
      align: 'center',
      width: 80
    },
    {
      key: 'method',
      title: 'method',
      align: 'center',
      width: 80
    },
    {
      key: 'url',
      title: 'url',
      align: 'center',
      minWidth: 120
    },
    {
      key: 'ip',
      title: 'ip',
      align: 'center',
      width: 100
    },
    {
      key: 'userAgent',
      title: 'userAgent',
      align: 'center',
      minWidth: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'params',
      title: 'params',
      align: 'center',
      minWidth: 150,
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return JSON.stringify(row.params);
      }
    },
    {
      key: 'duration',
      title: 'duration',
      align: 'center',
      width: 80
    },
    {
      key: 'startTime',
      title: 'startTime',
      align: 'center',
      minWidth: 100,
      render(row) {
        return dayjs(row.startTime).utc().add(8, 'hour').format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      key: 'endTime',
      title: 'endTime',
      align: 'center',
      minWidth: 100,
      render(row) {
        return dayjs(row.endTime).utc().add(8, 'hour').format('YYYY-MM-DD HH:mm:ss');
      }
    }
  ]
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OperationSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="operation log" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation :loading="loading" @refresh="getData" />
      </template>
      <NDataTable
        striped
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
