const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Ensure credentials exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase URL or Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'campaign-images';

// Helper to extract base64 data and mime type
function parseBase64(dataString) {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        return {
            type: matches[1],
            data: Buffer.from(matches[2], 'base64')
        };
    }
    return null;
}

// Helper to get file extension from mime type
function getExtension(mimeType) {
    switch (mimeType) {
        case 'image/jpeg': return 'jpg';
        case 'image/png': return 'png';
        case 'image/webp': return 'webp';
        case 'image/gif': return 'gif';
        default: return 'png'; // fallback
    }
}

async function migrateImages() {
    console.log("🚀 Starting Campaign Image Migration to Storage...");

    // 1. Check/Create Bucket
    try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.find(b => b.name === BUCKET_NAME);
        
        if (!bucketExists) {
            console.log(`📦 Creating public bucket: ${BUCKET_NAME}...`);
            const { error } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
            if (error) {
                console.warn(`⚠️ Could not create bucket automatically. Please ensure '${BUCKET_NAME}' exists and is public in the Supabase Dashboard.`, error.message);
            } else {
                console.log(`✅ Bucket '${BUCKET_NAME}' created successfully.`);
            }
        } else {
            console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
        }
    } catch (e) {
        console.warn(`⚠️ Error checking buckets (you may need to create '${BUCKET_NAME}' manually in the dashboard).`);
    }

    // 2. Fetch all campaigns
    console.log("🔍 Fetching campaigns...");
    const { data: campaigns, error: fetchError } = await supabase.from('campaigns').select('id, image, "tripImage", image_url, trip_image_url');
    
    if (fetchError) {
        console.error("❌ Failed to fetch campaigns:", fetchError);
        process.exit(1);
    }

    console.log(`Found ${campaigns.length} campaigns. Processing...`);

    let migratedCount = 0;

    for (const campaign of campaigns) {
        let updates = {};

        // Process main image
        if (campaign.image && campaign.image.startsWith('data:') && !campaign.image_url) {
            console.log(`  -> Processing main image for campaign: ${campaign.id}`);
            const parsed = parseBase64(campaign.image);
            if (parsed) {
                const ext = getExtension(parsed.type);
                const path = `campaigns/${campaign.id}/image.${ext}`;
                
                const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(path, parsed.data, {
                    contentType: parsed.type,
                    upsert: true
                });

                if (uploadError) {
                    console.error(`     ❌ Failed to upload main image:`, uploadError.message);
                } else {
                    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
                    updates.image_url = publicUrlData.publicUrl;
                    console.log(`     ✅ Uploaded to: ${updates.image_url}`);
                }
            }
        } else if (campaign.image_url) {
            console.log(`  -> Main image already migrated for ${campaign.id}`);
        }

        // Process trip image
        if (campaign.tripImage && campaign.tripImage.startsWith('data:') && !campaign.trip_image_url) {
            console.log(`  -> Processing trip image for campaign: ${campaign.id}`);
            const parsed = parseBase64(campaign.tripImage);
            if (parsed) {
                const ext = getExtension(parsed.type);
                const path = `campaigns/${campaign.id}/trip-image.${ext}`;
                
                const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(path, parsed.data, {
                    contentType: parsed.type,
                    upsert: true
                });

                if (uploadError) {
                    console.error(`     ❌ Failed to upload trip image:`, uploadError.message);
                } else {
                    const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
                    updates.trip_image_url = publicUrlData.publicUrl;
                    console.log(`     ✅ Uploaded to: ${updates.trip_image_url}`);
                }
            }
        } else if (campaign.trip_image_url) {
            console.log(`  -> Trip image already migrated for ${campaign.id}`);
        }

        // Update database if we have new URLs
        if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase.from('campaigns').update(updates).eq('id', campaign.id);
            if (updateError) {
                console.error(`     ❌ Failed to update database for ${campaign.id}:`, updateError.message);
            } else {
                console.log(`     ✅ Successfully updated database for ${campaign.id}`);
                migratedCount++;
            }
        }
    }

    console.log(`\n🎉 Migration Complete! Successfully migrated images for ${migratedCount} campaigns.`);
}

migrateImages();
