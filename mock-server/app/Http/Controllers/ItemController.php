<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

// models
use App\Models\Item;

// resources
use App\Http\Resources\ItemResource;

class ItemController extends Controller {
  /**
   * Display a listing of the resource.
   */
  public function index() {
    return response()->json(ItemResource::collection(Item::orderBy('created_at', 'desc')->get()));
  }

  /**
   * Display the specified resource.
   */
  public function show(Item $item) {
    if (empty($item)) {
      return response()->json([
        'message' => 'Item not found'
      ], 404);
    }

    return response()->json(new ItemResource($item));
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store() {
    $validator = Validator::make(request()->all(), [
      'name' => ['required', 'string', 'min:4', 'max:30'],
      'description' => ['required', 'string', 'min:10', 'max:200'],
      'price' => ['required', 'numeric', 'min:0.01', 'max:1000']
    ]);

    if ($validator->fails()) {
      return response()->json([
        'message' => 'Invalid input',
        'errors' => $validator->errors()
      ], 400);
    }

    $body = $validator->validated();
    $body['user_id'] = request()->user()->id;

    $item = Item::create($body);

    return response()->json(new ItemResource($item), 201);
  }


  /**
   * Update the specified resource in storage.
   */
  public function update(Item $item) {
    $validator = Validator::make(request()->all(), [
      'name' => ['string', 'min:4', 'max:30'],
      'description' => ['string', 'min:10', 'max:200'],
      'price' => ['numeric', 'min:0.01', 'max:1000']
    ]);

    if ($validator->fails()) {
      return response()->json([
        'message' => 'Invalid input',
        'errors' => $validator->errors()
      ], 400);
    }

    $body = $validator->validated();

    $item->update($body);

    return response()->json(new ItemResource($item));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Item $item) {
    $deletedResource = new ItemResource($item);

    $item->delete();

    return response()->json($deletedResource, 200);
  }
}
