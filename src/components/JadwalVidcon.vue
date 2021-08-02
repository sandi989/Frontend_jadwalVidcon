<!-- @format -->

<template>
  <v-main class="list">
    <v-card
      class="mx-auto pa-6"
      align="center"
      max-width="250px"
      color="#11698e"
      elevation="12"
      outlined
      shaped
    >
      <h3 class="headline white--text text--accent-2">List Jadwal Vidcon</h3>
    </v-card>
    <!-- <h3 class="text-h3 font-weight-medium mb-5">Jadwal Vidcon</h3> -->

    <v-card class="ma-5" elevation="12">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>
        <v-btn color="#11698e" dark @click="dialog = true">
          Tambah
        </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="jadwalVidcons" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-col style="transform:translate(-9%,0%)">
            <v-btn small class="mr-2" @click="editHandler(item)">
              <v-icon color="blue">mdi-square-edit-outline</v-icon>
            </v-btn>

            <v-btn small @click="deleteHandler(item.id)">
              <v-icon color="red">mdi-delete-alert-outline</v-icon>
            </v-btn>
          </v-col>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Jadwal Vidcon</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              v-model="form.kondisi"
              :items="['Jam Kerja', 'Luar Jam Kerja']"
              label="Kondisi"
              :rules="Rules"
              required
            ></v-select>

            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="tanggal"
                  label="Tanggal"
                  :rules="Rules"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="tanggal"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              v-model="form.jenis_bantuan"
              label="Jenis Bantuan"
              :rules="Rules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.lokasi"
              label="Lokasi"
              :rules="Rules"
              required
            ></v-text-field>

            <!-- <v-time-picker
              v-model="waktu"
              :allowed-hours="allowedHours"
              :allowed-minutes="allowedMinutes"
              class="mt-4"
              format="24hr"
              scrollable
            ></v-time-picker> -->

            <v-col>
              <v-dialog
                ref="dialog"
                v-model="modal2"
                :return-value.sync="time"
                persistent
                width="300px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="time"
                    label="Waktu"
                    prepend-icon="mdi-clock-time-four-outline"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="modal2"
                  v-model="time"
                  full-width
                  :allowed-hours="allowedHours"
                  :allowed-minutes="allowedMinutes"
                  class="mt-4"
                  format="24hr"
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="modal2 = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="$refs.dialog.save(time)">
                    OK
                  </v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>

            <v-text-field
              v-model="form.acara"
              label="Acara"
              :rules="Rules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.penyelenggara"
              label="Penyelenggara"
              :rules="Rules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.petugas"
              label="Petugas"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.no_surat"
              label="Nomor Surat"
              :rules="Rules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="setForm">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Warning!</span>
        </v-card-title>

        <v-card-text>
          Anda yakin ingin menghapus jadwal vidcon ini?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>

          <v-btn color="blue darken-1" text @click="deleteData">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      menu: false,
      modal2: false,
      time: "",
      headers: [
        {
          text: "Kondisi",
          align: "start",
          sortable: true,
          value: "kondisi",
        },
        { text: "Hari", value: "hari" },
        { text: "Tanggal", value: "tanggal" },
        { text: "Jenis_bantuan", value: "jenis_bantuan" },
        { text: "Lokasi", value: "lokasi" },
        { text: "Waktu", value: "waktu" },
        { text: "Acara", value: "acara" },
        { text: "Penyelenggara", value: "penyelenggara" },
        { text: "Petugas", value: "petugas" },
        { text: "Nomor Surat", value: "no_surat" },
        { text: "Actions", value: "actions" },
      ],
      jadwalVidcon: new FormData(),
      jadwalVidcons: [],
      form: {
        kondisi: "",
        tanggal: "",
        jenis_bantuan: "",
        lokasi: "",
        waktu: "",
        acara: "",
        penyelenggara: "",
        petugas: "",
        no_surat: "",
      },
      Rules: [(v) => !!v || "Tidak boleh kosong"],
      tanggal: new Date().toISOString().substr(0, 10),
      deleteId: "",
      editId: "",
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        this.save();
      } else {
        this.update();
      }
    },
    //read data jadwalVidcon
    readData() {
      var url = this.$api + "/jadwalVidcon";
      this.$http.get(url).then((response) => {
        this.jadwalVidcons = response.data.data;
      });
    },
    //simpan data jadwalVidcon
    save() {
      if (this.$refs.form.validate()) {
        this.jadwalVidcon.append("kondisi", this.form.kondisi);
        this.jadwalVidcon.append("tanggal", this.tanggal);
        this.jadwalVidcon.append("jenis_bantuan", this.form.jenis_bantuan);
        this.jadwalVidcon.append("lokasi", this.form.lokasi);
        this.jadwalVidcon.append("waktu", this.time);
        this.jadwalVidcon.append("acara", this.form.acara);
        this.jadwalVidcon.append("penyelenggara", this.form.penyelenggara);
        this.jadwalVidcon.append("petugas", this.form.petugas);
        this.jadwalVidcon.append("no_surat", this.form.no_surat);

        var url = this.$api + "/jadwalVidcon/";
        this.load = true;
        this.$http
          .post(url, this.jadwalVidcon, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.close();
            this.readData(); //mengambil data
            this.resetForm();
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    //ubah data jadwalVidcon
    update() {
      let newData = {
        kondisi: this.form.kondisi,
        tanggal: this.tanggal,
        jenis_bantuan: this.form.jenis_bantuan,
        lokasi: this.form.lokasi,
        waktu: this.time,
        acara: this.form.acara,
        penyelenggara: this.form.penyelenggara,
        petugas: this.form.petugas,
        no_surat: this.form.no_surat,
      };
      var url = this.$api + "/jadwalVidcon/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    //hapus data jadwalVidcon
    deleteData() {
      //mengahapus data
      var url = this.$api + "/jadwalVidcon/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.kondisi = item.kondisi;
      this.tanggal = item.tanggal;
      this.form.jenis_bantuan = item.jenis_bantuan;
      this.form.lokasi = item.lokasi;
      this.time = item.waktu;
      this.form.acara = item.acara;
      this.form.penyelenggara = item.penyelenggara;
      this.form.petugas = item.petugas;
      this.form.no_surat = item.no_surat;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        kondisi: "",
        tanggal: "",
        jenis_bantuan: "",
        lokasi: "",
        waktu: "",
        acara: "",
        penyelenggara: "",
        petugas: "",
        no_surat: "",
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>
