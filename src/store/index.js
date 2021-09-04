import { createStore } from 'vuex';

export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData = payload;
      // console.log('state.invoiceData: ', state.invoiceData);
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter((item) => {
        return item.invoiceId === payload;
      });
      console.log('Current Invoice:', state.currentInvoiceArray);
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    // delete the invoice with the passed ID from the invoiceData and then add the updated
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(
        (item) => item.id !== payload
      );
    },

    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((item) => {
        if (item.id === payload) {
          item.invoicePaid = true;
          item.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((item) => {
        if (item.id === payload) {
          item.invoicePaid = false;
          item.invoicePending = true;
          item.invoiceDraft = false;
        }
      });
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      try {
        const getData = await fetch(
          'https://vue-invoice-app-6f5f2-default-rtdb.europe-west1.firebasedatabase.app/invoices.json'
        );
        const result = await getData.json();

        if (!getData.ok) {
          const error = new Error(result.mesage || 'Failed to fetch!');
          throw error;
        }

        const invoices = [];

        for (const key in result) {
          if (!state.invoiceData.some((item) => item.id === key)) {
            const invoice = {
              id: key,
              invoiceId: result[key].invoiceId,
              billerStreetAddress: result[key].billerStreetAddress,
              billerCity: result[key].billerCity,
              billerZipCode: result[key].billerZipCode,
              billerCountry: result[key].billerCountry,
              clientName: result[key].clientName,
              clientEmail: result[key].clientEmail,
              clientStreetAddress: result[key].clientStreetAddress,
              clientCity: result[key].clientCity,
              clientZipCode: result[key].clientZipCode,
              clientCountry: result[key].clientCountry,
              invoiceDateUnix: result[key].invoiceDateUnix,
              invoiceDate: result[key].invoiceDate,
              paymentTerms: result[key].paymentTerms,
              paymentDueDateUnix: result[key].paymentDueDateUnix,
              paymentDueDate: result[key].paymentDueDate,
              productDescription: result[key].productDescription,
              invoiceItemList: result[key].invoiceItemList,
              invoiceTotal: result[key].invoiceTotal,
              invoicePending: result[key].invoicePending,
              invoiceDraft: result[key].invoiceDraft,
              invoicePaid: result[key].invoicePaid,
            };
            invoices.push(invoice);
          }
        }
        commit('SET_INVOICE_DATA', invoices);
        commit('INVOICES_LOADED');
      } catch (err) {
        console.log(err);
      }
    },

    async UPDATE_INVOICE({ commit, dispatch }, { id, routeId }) {
      //
      // delete the invoice from the data array
      commit('DELETE_INVOICE', id);
      await dispatch('GET_INVOICES');
      commit('TOGGLE_INVOICE');
      commit('TOGGLE_EDIT_INVOICE');
      commit('SET_CURRENT_INVOICE', routeId);
    },

    async DELETE_INVOICE_ACTION({ commit }, id) {
      console.log('id:', id);
      try {
        const result = await fetch(
          `https://vue-invoice-app-6f5f2-default-rtdb.europe-west1.firebasedatabase.app/invoices/${id}.json`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('DELETE_INVOICE ACTION result:', result);
        commit('DELETE_INVOICE', id);
      } catch (err) {
        console.log('Error deleting invoice:', err);
      }
    },

    async UPDATE_STATUS_TO_PAID({ commit }, id) {
      try {
        await fetch(
          `https://vue-invoice-app-6f5f2-default-rtdb.europe-west1.firebasedatabase.app/invoices/${id}.json`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              invoicePaid: true,
              invoicePending: false,
            }),
          }
        );

        commit('UPDATE_STATUS_TO_PAID', id);
      } catch (err) {
        console.log('Error deleting invoice:', err);
      }
    },

    async UPDATE_STATUS_TO_PENDING({ commit }, id) {
      try {
        await fetch(
          `https://vue-invoice-app-6f5f2-default-rtdb.europe-west1.firebasedatabase.app/invoices/${id}.json`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              invoicePaid: false,
              invoicePending: true,
              invoiceDraft: false,
            }),
          }
        );

        commit('UPDATE_STATUS_TO_PENDING', id);
      } catch (err) {
        console.log('Error deleting invoice:', err);
      }
    },
  },
});
