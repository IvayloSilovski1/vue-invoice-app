<template>
  <div class="home container">
    <!-- Header -->
    <div class="header flex">
      <!-- Left Side -->
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are {{ invoiceData.length }} total invoices</span>
        <InvoiceModal />
      </div>

      <div class="right flex">
        <!-- Filter  -->
        <div @click="toggleFilterMenu" class="filter flex" ref="filter">
          <span
            >Filter by Status:
            <span v-if="filteredInvoice">{{ filteredInvoice }}</span></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul v-if="filterMenu" class="filter-menu">
            <li @click="filteredInvoices">Draft</li>
            <li @click="filteredInvoices">Pending</li>
            <li @click="filteredInvoices">Paid</li>
            <li @click="filteredInvoices">Clear Filter</li>
          </ul>
        </div>

        <!-- Create new Invoice -->
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>

    <!-- Invoices -->
    <div v-if="!!invoiceData">
      <Invoice
        v-for="invoice in filterData"
        :invoice="invoice"
        :key="invoice.id"
      />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="empty" />
      <h3>There is nothing here</h3>
      <p>
        Create a new invoice by clicking the New Invoice button and get started
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import Invoice from "../components/Invoice.vue";

export default {
  name: "Home",
  components: { Invoice },
  data() {
    return {
      filterMenu: null,
      filteredInvoice: null,
    };
  },
  methods: {
    ...mapMutations(["TOGGLE_INVOICE"]),

    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },

    filteredInvoices(e) {
      if (e.target.innerText === "Clear Filter") {
        this.filteredInvoice = null;
        return;
      }
      this.filteredInvoice = e.target.innerText;
    },

    newInvoice() {
      this.TOGGLE_INVOICE();
    },
  },
  computed: {
    ...mapState(["invoiceData"]),

    filterData() {
      return this.invoiceData.filter((item) => {
        if (this.filteredInvoice === "Draft") {
          return item.invoiceDraft === true;
        }
        if (this.filteredInvoice === "Pending") {
          return item.invoicePending === true;
        }
        if (this.filteredInvoice === "Paid") {
          return item.invoicePaid === true;
        }
        return item;
      });
    },
  },
};
</script>



<style lang="scss" scoped>
.home {
  color: #fff;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter {
        position: relative;
        margin-right: 40px;
        cursor: pointer;

        span,
        img {
          pointer-events: none;
        }

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        li {
          cursor: pointer;
          font-size: 12px;
          padding: 10px 20px;

          &:hover {
            color: #1e2139;
            background-color: #fff;
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #7c5dfa;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;
    img {
      width: 214px;
      height: 200px;
    }
    h3 {
      font-size: 20px;
      margin-top: 40px;
    }
    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
