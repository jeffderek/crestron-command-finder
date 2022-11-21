<template>
    <div id="home">
        <div id="content">
            <div id="filter">
                <label for="filter-models" class="header">Model</label>
                <select name="filter-models" v-model="filterModels">
                    <option value="">All</option>
                    <option v-for="model in data.models" :value="model">{{ model }}</option>
                </select>
            </div>
            <div id="results">
                <div id="results-headers">
                    <div class="header">Command</div>
                    <div class="header">Access</div>
                    <div class="header">Description</div>
                    <input id="filter-command" v-model="filterCommand" />
                    <select name="accessors" v-model="filterAccessors">
                        <option value="">All</option>
                        <option v-for="accessor in data.accessors" :value="accessor">{{ accessor }}</option>
                    </select>
                    <input id="filter-description" v-model="filterDescription" />
                </div>
                <div id="results-body">
                    <template v-for="action in results">
                        <div>
                            {{ action.command }}
                        </div>
                        <div>
                            {{ action.access }}
                        </div>
                        <div>
                            {{ action.description }}
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import data from '@/assets/data.json';

const filterCommand = ref('');
const filterDescription = ref('');
const filterModels = ref('');
const filterAccessors = ref('');

const results = computed(() => {
    return data.actions.filter((action) => {
        let pass = true;
        if (!action.command.toUpperCase().includes(filterCommand.value.toUpperCase())) {
            pass = false;
        }

        if (!action.description.toUpperCase().includes(filterDescription.value.toUpperCase())) {
            pass = false;
        }
        console.log(action);

        if (filterModels.value) {
            if (!action.models.includes(filterModels.value)) {
                pass = false;
            }
        }

        if (filterAccessors.value) {
            if (!action.access.includes(filterAccessors.value)) {
                pass = false;
            }
        }

        return pass;
    });
});
</script>

<style lang="scss">
#home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    .header {
        font-weight: bold;
    }

    #content {
        width: 95%;
        height: 100%;
        display: grid;
        grid-template-columns: 300px auto;
        gap: 16px;

        #filter {
            display: flex;
            flex-direction: column;
            width: 100%;
            row-gap: 2px;
            column-gap: 16px;
            padding-bottom: 1rem;
        }

        #results {
            height: 100%;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            #results-headers {
                display: grid;
                grid-template-columns: 275px 100px auto;
                width: 100%;
                row-gap: 2px;
                column-gap: 16px;
                padding-bottom: 1rem;
            }

            #results-body {
                display: grid;
                grid-template-columns: 275px 100px auto;
                width: 100%;
                height: auto;
                row-gap: 2px;
                column-gap: 16px;
                overflow: auto;
            }
        }
    }
}
</style>
