<template>
    <!-- Need loading -->

    <div class="search-menu">
        <li class="search-type-navbar">
            <ul class="search-type">Flights</ul>
            <ul class="search-type">Departures</ul>
            <ul class="search-type">Arrivals</ul>
        </li>

        <div class="search-options-container">
            <div class="search-option">
                <button @click="toggleDropdown('state')" class="dropdown-toggle">
                    State
                </button>
                <div class="dropdown-container">
                    <div class="dropdown-content" v-show="dropdown === 'state'">
                        <ul>
                            <li>New South Wales - NSW</li>
                            <li>TAS - Tasmania</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="submit-search-container">
            <button>Search</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'SearchMenu',

        data() {
            return {
                dropdown: undefined,
            };
        },

        methods: {
            toggleDropdown(dropdown) {
                this.dropdown = dropdown === this.dropdown ? undefined : dropdown;
                if (this.dropdown) {
                    this.addClickDropdownListener();
                }
            },
            addClickDropdownListener() {
                document.body.addEventListener('click', this.handleClickDropdownEvent);
            },
            handleClickDropdownEvent() {
                // this.dropdown = undefined;
                document.body.removeEventListener('click', this.handleClickDropdownEvent);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .search-menu {
        background-color: white;

        .search-type-navbar {
            .search-type {
                display: inline-block;
            }
        }

        .search-options-container {
            .search-option {
                width: 250px;

                .dropdown-toggle {
                    border: 1px solid black;
                    background-color: white;
                    width: 100%;
                }

                .dropdown-container {
                    position: relative;
                    width: 100%;
                    
                    .dropdown-content {
                        position: absolute;
                        top: 0;
                        left: 0;

                        border: 1px solid black;
                        background-color: white;
                        width: 100%;

                        ul {
                            list-style: none;
                            padding: 0;
                            
                            li {
                                padding: 8px 16px;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>