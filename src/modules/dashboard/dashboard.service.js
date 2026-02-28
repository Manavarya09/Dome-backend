const supabase = require('../../config/supabaseClient');

class DashboardService {
    /**
     * Aggregates data for the dashboard.
     */
    static async getSummary(userId) {
        // 1. Get finance summary
        const { data: finances, error: financeError } = await supabase
            .from('transactions')
            .select('amount, category')
            .eq('user_id', userId);

        if (financeError) throw financeError;

        const totalSpent = finances.reduce((sum, txn) => sum + Number(txn.amount), 0);
        const spentByCategory = finances.reduce((acc, txn) => {
            acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
            return acc;
        }, {});

        // 2. Get assignments summary
        const { data: assignments, error: assignmentError } = await supabase
            .from('assignments')
            .select('status')
            .eq('user_id', userId);

        if (assignmentError) throw assignmentError;

        const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
        const completedAssignments = assignments.filter(a => a.status === 'completed').length;
        const totalAssignments = assignments.length;

        return {
            finance: {
                totalSpent,
                spentByCategory
            },
            assignments: {
                total: totalAssignments,
                pending: pendingAssignments,
                completed: completedAssignments
            }
        };
    }
}

module.exports = DashboardService;
