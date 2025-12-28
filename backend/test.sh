#!/bin/bash

echo "=== HireCandi API Integration Test ==="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s $BASE_URL/health | jq '.'
echo ""

# Test 2: Create Job
echo "2. Creating a new job..."
JOB_RESPONSE=$(curl -s -X POST $BASE_URL/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "jdText": "We are looking for a Senior Backend Engineer with 5+ years of experience in Node.js, Express, MongoDB, REST APIs, JavaScript, TypeScript, Docker, and AWS. Strong knowledge of system design, microservices architecture, and scalability required. Experience with Kubernetes is a plus."
  }')

echo "$JOB_RESPONSE" | jq '.'
JOB_ID=$(echo "$JOB_RESPONSE" | jq -r '.jobId')
echo ""
echo "Created Job ID: $JOB_ID"
echo ""

# Test 3: Check Job Status (empty)
echo "3. Checking job status (no resumes yet)..."
curl -s "$BASE_URL/api/jobs/$JOB_ID/status" | jq '.'
echo ""

# Test 4: Check Results (empty)
echo "4. Checking results (no resumes yet)..."
curl -s "$BASE_URL/api/jobs/$JOB_ID/results" | jq '.'
echo ""

echo "=== Test Complete ==="
echo ""
echo "To upload resumes, use:"
echo "curl -X POST $BASE_URL/api/jobs/$JOB_ID/resumes \\"
echo "  -F 'resumes=@/path/to/resume1.pdf' \\"
echo "  -F 'resumes=@/path/to/resume2.pdf'"
