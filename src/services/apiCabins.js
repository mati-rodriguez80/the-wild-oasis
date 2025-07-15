import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  // Here we check whether or not the cabin object already has and image path, that is, an existing image in the db.
  // On the other hand, newCabin.image might not be an string and in that case we cannot call startsWith function, so
  // that's why we use optional chaining here.
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Here replaceAll is very important because if, for example, a file is called something like '/cabin-001/2.jpg',
  // then supabase would create a new folder with this "cabin-001" and then create an image called "2.jpg".
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images//${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from("cabins");
  // Here the newCabin object will work because we register the inputs in CreateCabinForm component
  // with exactly the same name of the names of the columns in the backend.
  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uploading the file
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded and the cabin was not created");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
