import axios from 'axios';

interface Query {
    type: "1" | "2";
    range: [number, number];
}

interface InputData {
    token: string;
    data: number[];
    query: Query[];
}

interface OutputData {
    result: number[];
}

// Validate input 
function validateInputData(input: InputData): boolean {

    if (!Array.isArray(input.data) || input.data.length === 0 || input.data.length > 100000) {
        return false;
    }
    for (let num of input.data) {
        if (typeof num !== 'number' || num < 0) {
            return false; 
        }
    }

    // Validate query
    if (!Array.isArray(input.query)) {
        return false;
    }
    for (let q of input.query) { // type query
        if (q.type !== "1" && q.type !== "2") {
            return false; 
        }
        if (!Array.isArray(q.range) || q.range.length !== 2 || 
            typeof q.range[0] !== 'number' || typeof q.range[1] !== 'number' ||
            q.range[0] < 0 || q.range[1] < 0 || 
            q.range[0] > q.range[1] || 
            q.range[1] >= input.data.length) {
            return false; 
        }
    }

    return true; 
}

// Call API
async function fetchData(): Promise<InputData> {
    const inputUrl = 'https://test-share.shub.edu.vn/api/intern-test/input';
    const response = await axios.get(inputUrl);
    const inputData: InputData = response.data;
    if (!validateInputData(inputData)) {
        throw new Error("Invalid data!"); 
    }
    return inputData; 
}

// Send data
async function sendData(token: string, result: number[]): Promise<void> {
    const outputUrl = 'https://test-share.shub.edu.vn/api/intern-test/output';
    await axios.post(outputUrl, result , {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// Data processing
function computePrefixSums(data: number[]): { prefix_sum: number[], prefix_even: number[], prefix_odd: number[] } {
    const n = data.length;
    const prefix_sum = new Array(n).fill(0);
    const prefix_even = new Array(n).fill(0);
    const prefix_odd = new Array(n).fill(0);

    // Initialize initial values
    prefix_sum[0] = data[0];
    prefix_even[0] = data[0];
    prefix_odd[0] = 0;

    // O(n + q)
    for (let i = 1; i < n; i++) {
        prefix_sum[i] = prefix_sum[i - 1] + data[i];
        prefix_even[i] = prefix_even[i - 1] + (i % 2 === 0 ? data[i] : 0);
        prefix_odd[i] = prefix_odd[i - 1] + (i % 2 === 1 ? data[i] : 0);
    }

    return { prefix_sum, prefix_even, prefix_odd };
}

// Query processing
function processQuery(query: Query, prefix_sum: number[], prefix_even: number[], prefix_odd: number[]): number {
    const { type, range: [l, r] } = query;

    if (type === "1") { 
        return l === 0 ? prefix_sum[r] : prefix_sum[r] - prefix_sum[l - 1];
    } else {  
        const even_sum = prefix_even[r] - (l > 0 ? prefix_even[l - 1] : 0);
        const odd_sum = prefix_odd[r] - (l > 0 ? prefix_odd[l - 1] : 0);
        return even_sum - odd_sum;
    }
}


// Run 
async function run() {
    try {
        const inputData: InputData = await fetchData();
        const { token, data, query } = inputData;

        const { prefix_sum, prefix_even, prefix_odd } = computePrefixSums(data);
        console.log(data, query);
        console.log(prefix_sum, prefix_even);
        const result: number[] = query.map(q => processQuery(q, prefix_sum, prefix_even, prefix_odd));
        
        // Post api
        console.log('Successfully:', result);
        await sendData(token, result);
    } catch (error) {
        console.error('Error in processing:', error);
    }
}

run();
