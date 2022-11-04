<template>
    <div class="security-container">
        <div class="injection-container">
            <input v-model="safeSQL" type="checkbox" name="check">
            <label for="checked">{{ injectionDescription }}</label>
        </div>
        <div clasS="estates">
            <input type="text" v-model="realestateType">
            <button v-on:click="getRealEstates">Pretraži</button>
        </div>
        <div class="realestates" v-for="(realestate, index) in realestateData" :key="index">
            {{ realestate }}
        </div>
        <div class="csrf-container">
            <div v-html="messages"></div>
            <div>
                <input :value="safeCsrf" v-on:click="toggleCsrf" type="checkbox" name="csrf">
                <label for="csrf">{{ csrfDescription }}</label>
            </div>
            <button v-on:click="getMessages()">Pokusaj napada</button>
            <button v-on:click="resetData()">Korisnik dobiva ponovno 3 nekretnine</button>
            <button v-on:click="dangerousActionMadeSafe()">Siguran prijenos nekretnine</button>
        </div>
    </div>
</template>
<script>
import axios from "axios";
export default {
    name: "SecurityComponent",
    data() {
        return {
            safeSQL: false,
            safeCsrf: false,
            realestateType: "",
            realestateData: null,
            messages: null,
            chat_id: Date.now(),
            newMessage: "",
            token: null
        }
    },
    methods: {
        toggleSafeSQL() {
            this.safeSQL = !this.safeSQL;  
        },
        async getRealEstates() {
            if(!this.realestateType) return;
            if(this.safeSQL) {
                axios.get("https://backend-m1ks.onrender.com/injection/correct/" + this.realestateType, { withCredentials: true }).then((response) => {
                    this.setRealestateData(response.data);
                });
            } else {
                axios.get("https://backend-m1ks.onrender.com/injection/wrong/" + this.realestateType, { withCredentials: true }).then((response) => {
                    this.setRealestateData(response.data);
                });
            }
        },
        setRealestateData(data) {
            this.realestateData = data
        },
        getMessages() {
            axios.get("https://backend-m1ks.onrender.com/csrf/messages", { withCredentials: true }).then((response) => {
                this.messages = null;
                setTimeout(() => {
                    this.messages = response.data
                }, 100)
            })
        },
        async toggleCsrf() {
            this.safeCsrf = !this.safeCsrf;
            if(this.safeCsrf) {
                const res = await axios.get("https://backend-m1ks.onrender.com/csrf/set-token",
                    { withCredentials: true }).then((response) => {
                        this.token = response.data
                    });
            } else {
                this.token = null;
                console.log("reseting");
                await axios.post("https://backend-m1ks.onrender.com/csrf/reset-token", {}, { withCredentials: true });
            }
        },
        async resetData() {
            await axios.get("https://backend-m1ks.onrender.com/csrf/reset-db", { withCredentials: true });
        },
        async dangerousActionMadeSafe() {
            if(this.token === null) return;
            await axios.get("https://backend-m1ks.onrender.com/csrf/dangerous/" + this.token, { withCredentials: true });
        }
    },
    computed: {
        injectionDescription() {
            if(this.safeSQL) {
                return "SQL injekcija onemogućena";
            } else {
                return "SQL injekcija omogućena";
            }
        },
        csrfDescription() {
            if (this.safeSQL) {
                return "CSRF onemogućen";
            } else {
                return "CSRF omogućen";
            }
        }
    },
}
</script>
<style lang="css">

.security-container {
    display: flex;
    flex-direction: column;
    margin: 1em;
}

.estates {
    display: flex;
    flex-direction: column;
    margin: 1em;
}

.csrf-container{
    margin: 1em;
    margin-top: 3em;
}
    
</style>
