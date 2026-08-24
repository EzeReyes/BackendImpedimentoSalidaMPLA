
const dias = ["Domingo","Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

const transformDate = (date) => {

   // const dia = date.getDay();

   // const numeroDia = date.getDate();

   // const mes = date.getMonth();

   const horario = date.toLocaleString('es-AR', {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: 'numeric',
   hour12: false, // <-- Formato de 24 horas
   minute: 'numeric',
   second: 'numeric',
   timeZone: 'America/Argentina/Cordoba'
});

   return horario;

}


module.exports = transformDate;