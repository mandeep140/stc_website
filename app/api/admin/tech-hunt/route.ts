import { NextResponse } from "next/server";
import connectDB from "@/lib/connectdb";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ITechHuntUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  teamName: string;
  SunKey: string;
  MoonKey?: string;
  verifiedAt: {
    Sun?: string;
    Moon?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  [key: `level${number}Key`]: string | undefined;
}

// Define the model based on the actual collection structure
const Xenith =
  mongoose.models.Xenith ||
  mongoose.model<ITechHuntUser>(
    "Xenith",
    new mongoose.Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        teamName: { type: String, required: true },
        SunKey: { type: String, required: true },
        MoonKey: { type: String },
        verifiedAt: {
          Sun: { type: Date },
          Moon: { type: Date }
        },
      },
      { timestamps: true }
    )
  );

export async function DELETE(request: Request) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Delete the user
    const result = await Xenith.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get all users from the Xenith collection
    const users = await Xenith.find({})
      .select("name email teamName SunKey MoonKey verifiedAt createdAt")
      .lean<ITechHuntUser[]>();

    console.log("Users from DB:", users);

    // Transform the data to match the expected format
    const results = users.map((user) => {
      // Determine the highest level completed
      let level = 1;
      if (user.verifiedAt?.Moon) level = 2;

      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        teamName: user.teamName,
        // Include level keys
        SunKey: user.SunKey,
        MoonKey: user.MoonKey,
        // Set the key based on the user's level
        key: user[`level${level}Key`] || user.SunKey,
        level: level,
        SunTime: user.verifiedAt?.Sun,
        MoonTime: user.verifiedAt?.Moon,
        submittedAt: user.updatedAt || user.createdAt,
      };
});

    console.log("Transformed results:", results);

    // Sort results by submission time (newest first)
    const sortedResults = [...results].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    console.log("Final results before sending:", sortedResults);

    // Check if we have any data
    if (sortedResults.length === 0) {
      console.log("No results found in the Xenith collection.");
      const db = mongoose.connection.db;
      if (!db) {
        console.error("Database connection not established");
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 500 }
        );
      }
      const collections = await db.listCollections().toArray();
      console.log("Available collections in DB:", collections.map((c) => c.name));
    }

    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error("Error fetching Tech Hunt results:", error);
    return NextResponse.json(
      { error: "Failed to fetch Tech Hunt results" },
      { status: 500 }
    );
  }
}
