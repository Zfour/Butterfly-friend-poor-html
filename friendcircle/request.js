requests_url = 'https://hexo-circle-of-friends-api.vercel.app/api'
const friend_link_circle = new Vue({
    el: '#friend_link_circle',
    data: {
        datalist: [],
        datalist_slice:[],
        maxnumber:20,
        addnumber:10,
        display:true,
        loadmore_display:false,
        listlenth:0,
        today_post:0,
        last_update_time:'',
        user_lenth:'',
        error:0,
        unique_live_link:0

    },
    methods:{
        unique (arr) {
            return Array.from(new Set(arr))
        },
        formatDate(strDate) {
            try{
                var date = new Date(Date.parse(strDate.replace(/-/g, "/")))
                if (new Date().getTimezoneOffset()){
                    var gettimeoffset = new Date().getTimezoneOffset()
                }
                else{
                    var gettimeoffset = 8
                }
                var timeoffset = gettimeoffset * 60 * 1000
                var len = date.getTime()
                var date2 = new Date(len - timeoffset)
                var sec = date2.getSeconds().toString()
                var min =  date2.getMinutes().toString()
                if (sec.length == 1) {
                    sec = "0" + sec
                }
                if (min.length == 1) {
                    min = "0" + min
                }
                var data_result = date2.getFullYear().toString() + "/" + (date2.getMonth() + 1).toString() + "/" + date2.getDate().toString()+ " "
                    + date2.getHours().toString()+ ":"+ min + ":"+ sec


                return data_result
            }catch(e){return ""}
        },
        timezoon(){
            time = this.datalist_slice[0][1][0][5]
            timeformat = this.formatDate(time)
            return timeformat
        },
        todaypost(){
            date= new Date()
            var year = date.getFullYear()
            var month =(date.getMonth() + 1).toString()
            var day = (date.getDate()).toString()
            if (month.length == 1) {
                month = "0" + month
            }
            if (day.length == 1) {
                day = "0" + day
            }
            var dateTime = year + "-" + month + "-" + day
            return  dateTime
        },
        addmaxnumber(){
            this.maxnumber = this.maxnumber + this.addnumber
            if (this.maxnumber >= this.listlenth){
                this.loadmore_display=false
            }
        },
        slice(data){
            monthlist=[]
            datalist=[]
            data_slice = data
            for (item in data_slice) {
                data_slice[item].push(item)
                month=data_slice[item][1].slice(0,7)
                date= data_slice[item][1]


                if(monthlist.indexOf(month) != -1){
                    console.log(month)
                    datalist[monthlist.length-1][1].push(data_slice[item])
                }
                else{
                    monthlist.push(month)
                    datalist.push([month,[data_slice[item]]])
                }
            }

            for (mounthgroup  of datalist){
                mounthgroup.push(mounthgroup[1][0][6])
            }
            console.log(datalist)
            return datalist
        }
    },
    mounted: function () {

        fetch(requests_url).then(
            data => data.json()
        ).then(
            data => {
                today = this.todaypost()
                Datetody = new Date(today)
                for (var item = 0; item <data[1].length ;item++){
                    Datedate = new Date(data[1][item][1])
                    if (Datedate>Datetody){
                        data[1].splice(item --, 1)
                        console.log('穿越了')
                    }
                }
                this.datalist = data[1]
                this.listlenth = data[1].length
                this.user_lenth = data[0].length
                this.datalist_slice = this.slice(data[1])
                this.last_update_time =this.timezoon()
                this.loadmore_display = true
                link_list=[]
                for (item of data[1]){
                    if (item[1] == today ){
                        this.today_post +=1
                    }
                    link_list.push(item[3])
                }
                arr = this.unique(link_list)
                this.unique_live_link = arr.length
                for (item of data[0]){
                    if (item[3] == 'true' ){
                        this.error +=1
                    }
                }
            }
        )

    }
})