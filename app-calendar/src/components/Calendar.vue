<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <!--Botons de gregar -->
          <v-btn color="primary" dark class="mr-4" @click="dialog=true">
            Agregar
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                outlined
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">

        <!--Inicio del calendario -->
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>

        <!--Ventana Modal Dialog Evento-->
        <v-dialog v-model="dialog">
          <v-card>
            <v-container>
              <v-form @submit.prevent="addEvent">
                <v-text-field 
                  type="text" label="Nombre de Evento"  v-model="name" required>
                </v-text-field>
                <v-text-field 
                  type="text" label="Detalle"  v-model="details" required>
                </v-text-field>
                <v-text-field 
                  type="date" label="Inicio del Evento"  v-model="start" required>
                </v-text-field>
                <v-text-field 
                  type="date" label="Fin del Evento"  v-model="end" required>
                </v-text-field>
                <v-text-field 
                  type="color" label="Color de Nota"  v-model="color" required>
                </v-text-field>
                <!-- Botones -->
                <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog=false">
                  Add
                </v-btn>
                <v-btn color="warning" class="mr-4" @click.stop="dialog=false">
                  Cancel
                </v-btn>
                
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>
        <!--Fin Ventana Modal Dialog -->

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>

//import context db entre llaves para que vue js pued leerlo
    import {db} from '../main'

    export default {
        data: () => ({
        today: new Date().toISOString().substr(0,10),
        focus: new Date().toISOString().substr(0,10),
        type: 'month',
        typeToLabel: {
            month: 'Month',
            week: 'Week',
            day: 'Day',
            '4day': '4 Days',
        },
        start: null,
        end: null,
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        /*
        * Se establecen las propiedades para los objetos
        */
        //array events para la listas
        events: [

        ],
        //Agregar los objetos a tener en el calendar adicionales
        name: null, //nombre de la nota
        details:null, //detallle de la nota
        color: '#00ff00', //color de la nota
        dialog: false, //ventana dialog modal
        currentlyEditing:null //activa la edicion del dialog

        }),
        computed: {
        title () {
            const { start, end } = this
            if (!start || !end) {
            return ''
            }

            const startMonth = this.monthFormatter(start)
            const endMonth = this.monthFormatter(end)
            const suffixMonth = startMonth === endMonth ? '' : endMonth

            const startYear = start.year
            const endYear = end.year
            const suffixYear = startYear === endYear ? '' : endYear

            const startDay = start.day + this.nth(start.day)
            const endDay = end.day + this.nth(end.day)

            switch (this.type) {
            case 'month':
                return `${startMonth} ${startYear}`
            case 'week':
            case '4day':
                return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
            case 'day':
                return `${startMonth} ${startDay} ${startYear}`
            }
            return ''
        },
        monthFormatter () {
            return this.$refs.calendar.getFormatter({
            timeZone: 'UTC', month: 'long',
            })
        },
        },
        mounted () {
            this.$refs.calendar.checkChange();
        },
        created(){
            //cada vez que se monte el eventos se obtiene
            this.getEvents();
        },
        methods: {
            //eventos para 
            async getEvents(){
              try {
                //Se obtiene los evento de Firebase como coleccion
                const snapshot = await db.collection('eventosCalendario').get(); //evenosCalendario es objeto de firebase
                const events= [];
                //Se recorre el elemento como ciclo y se muestra
                snapshot.forEach(element => {
                  //console.log(element.data());
                  let eventoData = element.data();
                  eventoData.id =  element.id;

                  //se trae el array event declarado al inicio 
                  events.push(eventoData);
                });
                //se iguala el events local al array
                this.events = events;


              } catch (error) {
                console.log(error);
              }
            },
                
            viewDay ({ date }) {
                this.focus = date
                this.type = 'day'
            },
            getEventColor (event) {
                return event.color
            },
            setToday () {
                this.focus = this.today
            },
            prev () {
                this.$refs.calendar.prev()
            },
            next () {
                this.$refs.calendar.next()
            },
            showEvent ({ nativeEvent, event }) {
                const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                setTimeout(() => this.selectedOpen = true, 10)
                }

                if (this.selectedOpen) {
                this.selectedOpen = false
                setTimeout(open, 10)
                } else {
                open()
                }

                nativeEvent.stopPropagation()
            },
            updateRange ({ start, end }) {
                // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
                this.start = start
                this.end = end
            },
            nth (d) {
                return d > 3 && d < 21
                ? 'th'
                : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
            },
        },
    }
</script>
