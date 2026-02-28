const supabase = require('../../config/supabaseClient');

class FinanceService {
    /**
     * Retrieves transactions for a specific user optionally filtered by category and date range.
     */
    static async getTransactions(userId, filters = {}) {
        let query = supabase.from('transactions').select('*').eq('user_id', userId);

        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.startDate) {
            query = query.gte('date', filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte('date', filters.endDate);
        }

        const { data, error } = await query.order('date', { ascending: false });

        if (error) throw error;
        return data;
    }

    /**
     * Creates a new transaction.
     */
    static async createTransaction(userId, transactionData) {
        const { data, error } = await supabase
            .from('transactions')
            .insert([
                { user_id: userId, ...transactionData }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Updates an existing transaction verifying ownership.
     */
    static async updateTransaction(userId, transactionId, updateData) {
        const { data, error } = await supabase
            .from('transactions')
            .update(updateData)
            .eq('id', transactionId)
            .eq('user_id', userId) // Ensure the user actually owns this record
            .select()
            .single();

        if (error) {
            // If no rows were returned, `single()` throws a PostgrestError (code PGRST116)
            if (error.code === 'PGRST116') throw new Error('Transaction not found or unauthorized');
            throw error;
        }
        return data;
    }

    /**
     * Deletes a transaction verifying ownership.
     */
    static async deleteTransaction(userId, transactionId) {
        const { data, error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
            .eq('user_id', userId)
            .select() // Return the deleted row to ensure it existed
            .single();

        if (error) {
            if (error.code === 'PGRST116') throw new Error('Transaction not found or unauthorized');
            throw error;
        }
        return data;
    }
}

module.exports = FinanceService;
