<template>
    <div class="navbar-container">
        <nav>
            <router-link to="/about" class="nav-option">
                About
            </router-link>
            <router-link to="/airports/search" class="nav-option" v-show="$route.name !== 'airports-search'">
                <font-awesome-icon icon="fa-solid fa-house" class="icon" />
            </router-link>
        </nav>
    </div>
</template>

<script>
    export default {
        name: 'NavBar'
    };
</script>

<style>
    .navbar-container {
        width: 100%;
        background-color: white;
        box-shadow: 0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1);

        nav {
            height: 64px;
            max-width: var(--page-max-width);
            padding-left: 1rem;
            padding-right: 1rem;
            margin-left: auto;
            margin-right: auto;

            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: row-reverse;

            .nav-option {
                padding: 10px;

                font-size: 1.2rem;
                color: #394151;
                text-decoration: none;

                .icon {
                    font-size: 1.5rem;
                }
            }
        }
    }
</style>
