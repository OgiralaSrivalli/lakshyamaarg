const pool = require('../../config/db');

// Get opportunities with optional domain filter
const getOpportunities = async (req, res) => {
    try {
        const { domain, type } = req.query;

        let query = 'SELECT * FROM opportunities WHERE 1=1';
        const params = [];

        if (domain) {
            params.push(domain);
            query += ` AND LOWER(domain) LIKE LOWER($${params.length})`;
            // partial match
            params[params.length - 1] = '%' + domain + '%';
        }
        if (type) {
            params.push(type);
            query += ` AND type = $${params.length}`;
        }
        query += ' ORDER BY deadline ASC';

        const result = await pool.query(query, params);
        const now = new Date();

        const opportunities = result.rows.map(opp => {
            const deadline = new Date(opp.deadline);
            const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            return {
                ...opp,
                days_left: daysLeft > 0 ? daysLeft : 0,
                is_expired: daysLeft <= 0,
                deadline_display: deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            };
        });

        res.json({ success: true, opportunities, total: opportunities.length });
    } catch (err) {
        console.error('Opportunities error:', err);
        res.status(500).json({ success: false, message: 'Error fetching opportunities' });
    }
};

// Get single opportunity
const getOpportunityById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM opportunities WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Opportunity not found' });
        }
        const opp = result.rows[0];
        const now = new Date();
        const deadline = new Date(opp.deadline);
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        res.json({
            success: true,
            opportunity: {
                ...opp,
                days_left: daysLeft > 0 ? daysLeft : 0,
                is_expired: daysLeft <= 0,
            },
        });
    } catch (err) {
        console.error('Opportunity by ID error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getOpportunities, getOpportunityById };
